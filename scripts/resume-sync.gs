/**
 * Google Doc résumé sync — rebuilds the Doc's résumé sections from the site.
 *
 * Source of truth: lib/resume.ts and lib/projects.ts, published at build time as
 * https://sheljustdoes.github.io/resume.json. Each section between the Heading 1
 * titles below is rebuilt to say exactly what the site says. Everything above
 * SUMMARY (name, title, contact) is never touched.
 *
 * Styling is copied, not coded. Before a section is rebuilt, one existing line
 * of each kind is kept as a pattern — a bullet, a role title, a project name —
 * and every new line is a copy of its pattern with the text swapped. Fonts,
 * weights (including Light, which Apps Script cannot set), colours and spacing
 * therefore stay exactly as styled in the Doc. To restyle, restyle the Doc: the
 * next rebuild copies the new look.
 *
 * Each section, on each run, ends in one of three ways:
 *   - up to date  it already reads exactly as the site would write it. Nothing is
 *                 written, so the Doc's modified time only moves when content
 *                 really changes — the reconcile step relies on that.
 *   - written     it is exactly what this script last wrote, and the site has
 *                 changed since. The section is rebuilt.
 *   - blocked     it was edited in the Doc since the last sync. It is NOT
 *                 overwritten: move the edit to the site, after which the next
 *                 sync finds the two equal and resumes; or use Résumé → Force sync.
 * Sections are independent: one blocked section does not stop the others.
 *
 * It fails closed: if the feed cannot be fetched or parsed, or any section title
 * is missing, nothing is changed. A failed or blocked scheduled run is reported by
 * Google's trigger-failure email.
 *
 * Setup, or after pasting a new version: in a browser window signed into ONLY the
 * Doc's owning account (with several Google accounts signed in, the Apps Script
 * editor opens under the default account and fails to load):
 *   1. In the Doc: Extensions → Apps Script. Replace the code with this file, save.
 *   2. Choose `installDailyTrigger` in the function dropdown and Run.
 *   3. Approve the permissions. "Google hasn't verified this app" is expected for a
 *      personal script: Advanced → Go to (project name).
 * Installing is a deliberate takeover: every section is rebuilt from the site,
 * replacing whatever is there. After that the Doc checks daily, as the owner.
 * Reload the Doc to see the Résumé menu.
 */

/** @OnlyCurrentDoc Limits Docs access to this one document. */

const FEED_URL = "https://sheljustdoes.github.io/resume.json";
const SECTIONS = ["SUMMARY", "EXPERIENCE", "EDUCATION", "CERTIFICATIONS", "PROJECTS", "SKILLS"];
const HASH_PREFIX = "hash:";

function onOpen() {
  DocumentApp.getUi()
    .createMenu("Résumé")
    .addItem("Sync now", "menuSync")
    .addItem("Force sync (discard Doc edits)", "menuForceSync")
    .addToUi();
}

function installDailyTrigger() {
  for (const t of ScriptApp.getProjectTriggers()) {
    if (t.getHandlerFunction() === "syncProjects" || t.getHandlerFunction() === "syncResume") ScriptApp.deleteTrigger(t);
  }
  ScriptApp.newTrigger("syncResume").timeBased().everyDays(1).atHour(6).create();
  const outcome = runSync_(true);
  Logger.log(outcome.message);
}

/** Scheduled entry point. Throws when a section is blocked, so Google emails it. */
function syncResume() {
  const outcome = runSync_(false);
  if (outcome.blocked.length) throw new Error(outcome.message);
}

/** The previous version's trigger name, kept so an old trigger keeps working. */
function syncProjects() {
  syncResume();
}

function menuSync() {
  DocumentApp.getUi().alert(runSync_(false).message);
}

function menuForceSync() {
  const ui = DocumentApp.getUi();
  const ok = ui.alert(
    "Discard Doc edits?",
    "Every section will be rebuilt from the site, and edits made to them in this Doc will be lost " +
      "(File → Version history still has them).",
    ui.ButtonSet.OK_CANCEL,
  );
  if (ok === ui.Button.OK) ui.alert(runSync_(true).message);
}

function runSync_(force) {
  const feed = fetchFeed_();
  const body = DocumentApp.getActiveDocument().getBody();
  const props = PropertiesService.getDocumentProperties();

  // Google Docs cannot delete a document's final paragraph, so the last section
  // always ends before an empty one.
  if (!isEmpty_(body.getChild(body.getNumChildren() - 1))) body.appendParagraph("");

  // Plan every section before touching any, so a missing title changes nothing.
  const spans = findSections_(body);
  if (force) clearHashes_(props);
  const plans = SECTIONS.map((name) => {
    const span = spans[name];
    const current = sectionText_(body, span);
    const items = planSection_(name, feed, endsWithSpacer_(body, span));
    const rendered = normalize_(items.map((i) => i.text).join("\n"));
    return { name, span, current, items, decision: decide_(current, rendered, props.getProperty(HASH_PREFIX + name), force, hash_) };
  });

  // Rebuild bottom-up, so indices of the sections still to do do not shift.
  for (const plan of plans.slice().reverse()) {
    if (plan.decision === "up-to-date") props.setProperty(HASH_PREFIX + plan.name, hash_(plan.current));
    if (plan.decision !== "write") continue;
    const patterns = capturePatterns_(plan.name, body, plan.span);
    for (let i = plan.span.end - 1; i > plan.span.start; i--) body.getChild(i).removeFromParent();
    let at = plan.span.start + 1;
    for (const item of plan.items) at = insertItem_(body, at, item, patterns);
  }

  // Record what is actually in the Doc now, so the next run can tell a hand edit
  // from an untouched section.
  const after = findSections_(body);
  for (const plan of plans) {
    if (plan.decision === "write") props.setProperty(HASH_PREFIX + plan.name, hash_(sectionText_(body, after[plan.name])));
  }
  props.setProperty("lastResumeSync", new Date().toISOString());

  const written = plans.filter((p) => p.decision === "write").map((p) => p.name);
  const blocked = plans.filter((p) => p.decision === "blocked").map((p) => p.name);
  const lines = [written.length ? `Rebuilt from the site: ${written.join(", ")}.` : "Every section is already up to date with the site."];
  if (blocked.length) {
    lines.push(
      `Edited in this Doc since the last sync, so left as they are: ${blocked.join(", ")}. ` +
        "Move those edits to the site and the next sync resumes, or use Résumé → Force sync to discard them.",
    );
  }
  return { written, blocked, message: lines.join("\n\n") };
}

/**
 * The whole policy, kept pure so it can be tested outside Apps Script.
 * No stored hash means the script has never written this section (first install,
 * or a takeover), so what it replaces is expected and not treated as an edit.
 */
function decide_(current, rendered, lastHash, force, hash) {
  if (current === rendered) return "up-to-date";
  if (force || !lastHash) return "write";
  return hash(current) === lastHash ? "write" : "blocked";
}

// ---- What each section should contain, line by line ----
//
// Each item names the pattern it is copied from. `trail` keeps a blank line at
// the end of a section that already ends with one.

function planSection_(name, feed, trailing) {
  const items = [];
  const add = (kind, text, extra) => items.push(Object.assign({ kind, text }, extra || {}));
  switch (name) {
    case "SUMMARY":
      add("para", feed.summary);
      break;
    case "EXPERIENCE":
      feed.experience.forEach((role, i) => {
        if (i > 0) add("spacer", "");
        add("title", role.title);
        add("company", role.company);
        add("dates", role.dates);
        if (role.lead) add("lead", role.lead);
        for (const b of role.bullets) add("bullet", b);
      });
      break;
    case "EDUCATION":
    case "CERTIFICATIONS":
      for (const line of feed[name.toLowerCase()]) add("item", line);
      break;
    case "PROJECTS":
      for (const area of feed.projects) {
        add("area", area.label);
        for (const p of area.projects) {
          add("ptitle", p.meta ? `${p.name}.  ${p.meta}` : `${p.name}.`, { nameLength: p.name.length + 1 });
          add("psummary", p.summary);
        }
      }
      break;
    case "SKILLS":
      add("para", feed.skills);
      break;
  }
  if (trailing) add("trail", "");
  return items;
}

// ---- Patterns: one existing line of each kind, copied before the rebuild ----

function capturePatterns_(name, body, span) {
  const T = DocumentApp.ElementType;
  const H = DocumentApp.ParagraphHeading;
  const pats = {};
  const els = [];
  for (let i = span.start + 1; i < span.end; i++) els.push(body.getChild(i));
  const keep = (kind, el) => {
    if (el && !pats[kind]) pats[kind] = el.copy();
  };
  const heading = (el) => (el.getType() === T.PARAGRAPH ? el.asParagraph().getHeading() : null);

  const last = els[els.length - 1];
  if (last && isEmpty_(last)) keep("trail", last);
  keep("spacer", els.slice(0, -1).find((el) => isEmpty_(el)) || (last && isEmpty_(last) ? last : null));

  const filled = els.filter((el) => !isEmpty_(el));
  const firstList = filled.find((el) => el.getType() === T.LIST_ITEM);
  const firstPara = filled.find((el) => el.getType() === T.PARAGRAPH);

  if (name === "SUMMARY" || name === "SKILLS") keep("para", firstPara);
  if (name === "EDUCATION" || name === "CERTIFICATIONS") keep("item", firstList);
  if (name === "EXPERIENCE") {
    const h3 = filled.filter((el) => heading(el) === H.HEADING3);
    keep("title", h3[0]);
    keep("company", h3[1]);
    keep("dates", h3[2]);
    keep("lead", filled.find((el) => el.getType() === T.TABLE) || filled.find((el) => heading(el) === H.HEADING4));
    keep("bullet", firstList);
  }
  if (name === "PROJECTS") {
    keep("area", filled.find((el) => heading(el) === H.HEADING2));
    keep("ptitle", filled.find((el) => heading(el) === H.HEADING3));
    keep("psummary", firstList);
  }
  return pats;
}

/** Headings used when a section has no line of that kind to copy from. */
const FALLBACK_HEADING = {
  title: "HEADING3", company: "HEADING3", dates: "HEADING3", lead: "HEADING4",
  area: "HEADING2", ptitle: "HEADING3", para: "NORMAL", spacer: "NORMAL", trail: "NORMAL",
};
const LIST_KINDS = { bullet: true, item: true, psummary: true };

function insertItem_(body, at, item, pats) {
  const T = DocumentApp.ElementType;
  const pattern = pats[item.kind] || (item.kind === "trail" ? pats.spacer : null);
  let el;
  if (pattern) {
    const copy = pattern.copy();
    if (copy.getType() === T.LIST_ITEM) el = body.insertListItem(at, copy.asListItem());
    else if (copy.getType() === T.TABLE) el = body.insertTable(at, copy.asTable());
    else el = body.insertParagraph(at, copy.asParagraph());
    setTextKeepingStyle_(textTarget_(el), item.text);
  } else if (LIST_KINDS[item.kind]) {
    el = body.insertListItem(at, item.text).setGlyphType(DocumentApp.GlyphType.BULLET);
  } else {
    el = body.insertParagraph(at, item.text).setHeading(DocumentApp.ParagraphHeading[FALLBACK_HEADING[item.kind] || "NORMAL"]);
  }
  // Project lines: the name keeps the pattern's weight; the date and status after
  // it are set back to regular.
  if (item.kind === "ptitle" && item.text.length > item.nameLength) {
    textTarget_(el).editAsText().setBold(item.nameLength, item.text.length - 1, false);
  }
  return at + 1;
}

/** The paragraph whose text a line carries: itself, or a table's first cell. */
function textTarget_(el) {
  const T = DocumentApp.ElementType;
  if (el.getType() === T.TABLE) return el.asTable().getCell(0, 0).getChild(0).asParagraph();
  return el.getType() === T.LIST_ITEM ? el.asListItem() : el.asParagraph();
}

/**
 * Swaps a copied line's text while keeping its formatting. replaceText keeps the
 * style of the text it replaces, which is what carries weights like Light that
 * cannot be set from Apps Script.
 */
function setTextKeepingStyle_(para, text) {
  if (para.getText() === "") {
    if (text) para.appendText(text);
    return;
  }
  if (text === "") {
    para.clear();
    return;
  }
  para.replaceText("^.*$", text.replace(/\\/g, "\\\\").replace(/\$/g, "\\$"));
}

// ---- Reading the Doc ----

function findSections_(body) {
  const at = {};
  const h1 = [];
  for (let i = 0; i < body.getNumChildren(); i++) {
    const el = body.getChild(i);
    if (el.getType() !== DocumentApp.ElementType.PARAGRAPH) continue;
    const p = el.asParagraph();
    if (p.getHeading() !== DocumentApp.ParagraphHeading.HEADING1) continue;
    h1.push(i);
    const name = p.getText().trim().toUpperCase();
    if (SECTIONS.indexOf(name) >= 0 && at[name] === undefined) at[name] = i;
  }
  const spans = {};
  for (const name of SECTIONS) {
    const start = at[name];
    if (start === undefined) throw new Error(`No "${name}" Heading 1 found; Doc left unchanged.`);
    const next = h1.find((i) => i > start);
    spans[name] = { start, end: next === undefined ? body.getNumChildren() - 1 : next };
  }
  return spans;
}

function sectionText_(body, span) {
  const lines = [];
  for (let i = span.start + 1; i < span.end; i++) lines.push(elementText_(body.getChild(i)));
  return normalize_(lines.join("\n"));
}

function elementText_(el) {
  const T = DocumentApp.ElementType;
  switch (el.getType()) {
    case T.PARAGRAPH: return el.asParagraph().getText();
    case T.LIST_ITEM: return el.asListItem().getText();
    case T.TABLE: return el.asTable().getText();
    default: return `[${el.getType()}]`;
  }
}

function isEmpty_(el) {
  const T = DocumentApp.ElementType;
  return (el.getType() === T.PARAGRAPH || el.getType() === T.LIST_ITEM) && elementText_(el).trim() === "";
}

function endsWithSpacer_(body, span) {
  return span.end - 1 > span.start && isEmpty_(body.getChild(span.end - 1));
}

/** Non-breaking spaces and trailing whitespace are not differences. */
function normalize_(text) {
  return text.split("\n").map((l) => l.replace(/ /g, " ").replace(/\s+$/, "")).join("\n");
}

function fetchFeed_() {
  const res = UrlFetchApp.fetch(FEED_URL, { muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) {
    throw new Error(`Feed returned HTTP ${res.getResponseCode()}; Doc left unchanged.`);
  }
  const feed = JSON.parse(res.getContentText());
  const ok =
    feed && typeof feed.summary === "string" && Array.isArray(feed.experience) && feed.experience.length > 0 &&
    Array.isArray(feed.education) && Array.isArray(feed.certifications) && typeof feed.skills === "string" &&
    Array.isArray(feed.projects) && feed.projects.length > 0;
  if (!ok) throw new Error("Feed is missing a section; Doc left unchanged.");
  return feed;
}

function clearHashes_(props) {
  for (const key of Object.keys(props.getProperties())) {
    if (key.indexOf(HASH_PREFIX) === 0 || key === "projectSectionHash") props.deleteProperty(key);
  }
}

function hash_(text) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8);
  return Utilities.base64Encode(digest);
}
