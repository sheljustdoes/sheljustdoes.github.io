// Tests scripts/resume-sync.gs against a mock Google Doc shaped like the real
// résumé (header block, six Heading 1 sections, a one-cell lead table, blank
// spacers, and the final empty paragraph), fed with the real build output.
//
// Apps Script cannot run here, so this checks what matters most: every section
// is written only when it should be, a hand edit is never lost, the header is
// never touched, and each rebuilt line keeps the style of the line it was copied
// from. Runs in postbuild after check-projects.mjs.

import vm from "node:vm";
import fs from "node:fs";
import crypto from "node:crypto";

const src = fs.readFileSync("scripts/resume-sync.gs", "utf8");
const liveFeed = JSON.parse(fs.readFileSync("out/resume.json", "utf8"));

// ---- Mock DocumentApp ----
const T = { PARAGRAPH: "PARAGRAPH", LIST_ITEM: "LIST_ITEM", TABLE: "TABLE" };
const H = { NORMAL: "NORMAL", HEADING1: "HEADING1", HEADING2: "HEADING2", HEADING3: "HEADING3", HEADING4: "HEADING4" };

let kids, writes;
const node = (type, text, heading, style) => ({ type, text, heading: heading || H.NORMAL, style, bold: [], cell: null });
const clone = (n) => ({ ...n, bold: [...n.bold], cell: n.cell ? clone(n.cell) : null });

// Every element, attached or copied, is a wrapper that carries its node, can be
// copied again, and answers the as*() casts with itself — as Apps Script does.
function wrap(n) {
  const w = {
    __node: n,
    getType: () => n.type,
    getText: () => (n.type === T.TABLE ? n.cell.text : n.text),
    getHeading: () => n.heading,
    replaceText: (_re, rep) => { n.text = rep.replace(/\\\$/g, "$").replace(/\\\\/g, "\\"); writes++; return w; },
    appendText: (t) => { n.text += t; writes++; },
    clear: () => { n.text = ""; writes++; return w; },
    editAsText: () => ({ setBold: (s, e, v) => { n.bold.push([s, e, v]); } }),
    setGlyphType: () => w,
    setHeading: (h) => { n.heading = h; return w; },
    getCell: () => ({ getChild: () => wrap(n.cell) }),
    asParagraph: () => w,
    asListItem: () => w,
    asTable: () => w,
    copy: () => wrap(clone(n)),
    removeFromParent: () => { kids.splice(kids.indexOf(n), 1); writes++; },
  };
  return w;
}
const insert = (i, arg, type) => {
  const n = arg && arg.__node ? arg.__node : node(type, arg, H.NORMAL, "fallback");
  kids.splice(i, 0, n); writes++;
  return wrap(n);
};
const body = {
  getNumChildren: () => kids.length,
  getChild: (i) => wrap(kids[i]),
  insertParagraph: (i, a) => insert(i, a, T.PARAGRAPH),
  insertListItem: (i, a) => insert(i, a, T.LIST_ITEM),
  insertTable: (i, a) => insert(i, a, T.TABLE),
  appendParagraph: (t) => insert(kids.length, t, T.PARAGRAPH),
};

let store = {};
let feedText = JSON.stringify(liveFeed);
let feedStatus = 200;
const ctx = {
  DocumentApp: {
    ElementType: T, ParagraphHeading: H, GlyphType: { BULLET: 1 },
    getActiveDocument: () => ({ getBody: () => body }),
  },
  PropertiesService: {
    getDocumentProperties: () => ({
      getProperty: (k) => store[k] ?? null,
      setProperty: (k, v) => { store[k] = v; },
      getProperties: () => ({ ...store }),
      deleteProperty: (k) => { delete store[k]; },
    }),
  },
  UrlFetchApp: { fetch: () => ({ getResponseCode: () => feedStatus, getContentText: () => feedText }) },
  Utilities: {
    DigestAlgorithm: {}, Charset: {},
    computeDigest: (_a, t) => crypto.createHash("sha256").update(t).digest(),
    base64Encode: (b) => b.toString("base64"),
  },
  Logger: { log: () => {} },
  ScriptApp: { getProjectTriggers: () => [], deleteTrigger: () => {}, newTrigger: () => ({ timeBased: () => ({ everyDays: () => ({ atHour: () => ({ create: () => {} }) }) }) }) },
};
vm.createContext(ctx);
vm.runInContext(src, ctx);

// ---- A Doc shaped like the real one, before the first full sync ----
const P = (text, heading, style) => node(T.PARAGRAPH, text, heading, style);
const L = (text, style) => node(T.LIST_ITEM, text, H.NORMAL, style);
const table = (text) => { const t = node(T.TABLE, "", H.NORMAL, "lead-table"); t.cell = P(text, H.HEADING4, "lead-mono"); return t; };
kids = [
  P("", H.NORMAL, "top"),
  P("Shel Burkes, PhD", H.NORMAL, "name"),
  P("Principal Applied Scientist | AI for Life Sciences", H.HEADING1, "subtitle"),
  P("Email: … | Website: …", H.NORMAL, "contact"),
  P("SUMMARY", H.HEADING1, "h1"), P("Old summary", H.NORMAL, "body-light"),
  P("EXPERIENCE", H.HEADING1, "h1"),
  P("Principal Applied Scientist", H.HEADING3, "role-bold"), P("Old company", H.HEADING3, "role-italic"), P("09/2025 - Present", H.HEADING3, "role-date"),
  L("Old bullet one", "bullet-light"), L("Old bullet two", "bullet-light"),
  P("", H.HEADING3, "spacer-h3"),
  P("Consultant", H.HEADING3, "role-bold"), P("Independent Consultant", H.HEADING3, "role-italic"), P("09/2021 - 09/2025", H.HEADING3, "role-date"),
  table("Old lead"), L("Old bullet three", "bullet-light"),
  P("", H.NORMAL, "trail-p"),
  P("EDUCATION", H.HEADING1, "h1"), L("Old degree", "edu-light"), P("", H.NORMAL, "trail-p"),
  P("CERTIFICATIONS", H.HEADING1, "h1"), L("Old cert", "edu-light"), P("", H.NORMAL, "trail-p"),
  P("PROJECTS", H.HEADING1, "h1"),
  P("Old Area", H.HEADING2, "area-outfit"), P("old.  2020 · Shipped", H.HEADING3, "ptitle-lora"), L("Old project summary", "psummary-light"),
  P("SKILLS", H.HEADING1, "h1"), P("Old skills", H.NORMAL, "body-light"),
  P("", H.NORMAL, "final"),
];
const header = kids.slice(0, 4).map((n) => n.text).join("|");

// ---- Helpers ----
const run = (label, fn, expect) => {
  writes = 0;
  let r;
  try { r = fn(); } catch (e) { r = { threw: e.message }; }
  const got = r?.threw ? "threw" : expect.check(r);
  const ok = got === true || got === expect.want;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${expect.note ? ` — ${expect.note(r)}` : ""}`);
  if (!ok) { console.log("      got:", r); process.exitCode = 1; }
  return r;
};
const section = (name) => {
  const s = kids.findIndex((n) => n.heading === H.HEADING1 && n.text === name);
  let e = kids.findIndex((n, i) => i > s && n.heading === H.HEADING1);
  if (e < 0) e = kids.length - 1;
  return kids.slice(s + 1, e);
};
const assert = (label, cond) => { console.log(`${cond ? "PASS" : "FAIL"}  ${label}`); if (!cond) process.exitCode = 1; };

// ---- Scenarios ----
run("install takes over: every section rebuilt", () => { ctx.installDailyTrigger(); return store; },
  { check: () => ["SUMMARY", "EXPERIENCE", "EDUCATION", "CERTIFICATIONS", "PROJECTS", "SKILLS"].every((s) => store["hash:" + s]), want: true });

const exp = section("EXPERIENCE");
assert("header block untouched", kids.slice(0, 4).map((n) => n.text).join("|") === header);
assert("final empty paragraph kept", kids.at(-1).style === "final" && kids.at(-1).text === "");
assert(`experience: ${liveFeed.experience.length} roles, blank line between each`,
  exp.filter((n) => n.style === "role-bold").length === liveFeed.experience.length &&
  exp.filter((n) => n.style === "spacer-h3").length === liveFeed.experience.length - 1);
assert("consulting lead keeps its one-cell table",
  exp.filter((n) => n.type === T.TABLE).length === liveFeed.experience.filter((r) => r.lead).length &&
  exp.find((n) => n.type === T.TABLE).cell.style === "lead-mono");
assert("every bullet copied from the bullet pattern (Outfit Light survives)",
  exp.filter((n) => n.type === T.LIST_ITEM).every((n) => n.style === "bullet-light") &&
  exp.filter((n) => n.type === T.LIST_ITEM).length === liveFeed.experience.reduce((a, r) => a + r.bullets.length, 0));
assert("sections keep their trailing blank line", ["EXPERIENCE", "EDUCATION", "CERTIFICATIONS"].every((s) => section(s).at(-1).style === "trail-p"));
assert("no line fell back to default styling", !kids.some((n) => n.style === "fallback"));
const pt = section("PROJECTS").filter((n) => n.style === "ptitle-lora");
assert("project names bold, dates and status set back to regular",
  pt.length === liveFeed.projects.reduce((a, g) => a + g.projects.length, 0) && pt.every((n) => n.bold.some(([s, , v]) => v === false && s > 0)));
assert("summary and skills say what the site says",
  section("SUMMARY")[0].text === liveFeed.summary && section("SKILLS")[0].text === liveFeed.skills);

run("second run, nothing changed → nothing written", () => ctx.runSync_(false),
  { check: (r) => r.written.length === 0 && r.blocked.length === 0 && writes === 0, want: true, note: () => `writes=${writes}` });

const edited = section("EXPERIENCE").find((n) => n.type === T.LIST_ITEM);
edited.text += " (edited in the Doc)";
const feed2 = JSON.parse(feedText);
feed2.skills += ", Rust";
feedText = JSON.stringify(feed2);
run("hand edit in EXPERIENCE + site change in SKILLS → EXPERIENCE blocked, SKILLS rebuilt",
  () => ctx.runSync_(false), { check: (r) => r.blocked.join() === "EXPERIENCE" && r.written.join() === "SKILLS", want: true });
assert("the hand edit survived", edited.text.endsWith("(edited in the Doc)"));
run("scheduled run reports the blocked section by failing", () => ctx.syncResume(), { check: () => false, want: "threw" });

feed2.experience[0].bullets[0] += " (edited in the Doc)";
feedText = JSON.stringify(feed2);
run("edit merged into the site → equal, unblocks without writing", () => ctx.runSync_(false),
  { check: (r) => r.written.length === 0 && r.blocked.length === 0 && writes === 0, want: true });

edited.text = "another Doc edit";
run("force sync discards the Doc edit", () => ctx.runSync_(true), { check: (r) => r.written.join() === "EXPERIENCE", want: true });

const snapshot = JSON.stringify(kids);
feedStatus = 500;
run("feed unavailable → throws", () => ctx.runSync_(false), { check: () => false, want: "threw" });
feedStatus = 200;
feedText = JSON.stringify({ ...feed2, experience: [] });
run("feed missing a section → throws", () => ctx.runSync_(false), { check: () => false, want: "threw" });
feedText = JSON.stringify(feed2);
const skills = kids.findIndex((n) => n.text === "SKILLS");
kids[skills].heading = H.NORMAL;
run("SKILLS title missing → throws", () => ctx.runSync_(false), { check: () => false, want: "threw" });
kids[skills].heading = H.HEADING1;
assert("…and none of those failures changed the Doc", JSON.stringify(kids) === snapshot);
