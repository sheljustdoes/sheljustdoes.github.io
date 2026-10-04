// Decrypts locked projects' files (scripts/protect.mjs) for a browser that has unlocked
// them. Each locked file is stored as <path>.enc (12-byte IV, then AES-GCM ciphertext); a
// page is <dir>/index.html.enc. Keys sit in IndexedDB ("locks"), put there by
// /locks/lock.js. Without a key, or with a stale one, requests pass through to the lock page.

const TYPES = {
  html: "text/html; charset=utf-8", txt: "text/plain; charset=utf-8", js: "application/javascript; charset=utf-8",
  json: "application/json", css: "text/css", csv: "text/csv; charset=utf-8", md: "text/markdown; charset=utf-8",
  svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", gif: "image/gif",
  pdf: "application/pdf", woff2: "font/woff2",
};

let manifest = null;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

function store(mode, fn) {
  return new Promise((ok, fail) => {
    const req = indexedDB.open("locks", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("keys");
    req.onerror = () => fail(req.error);
    req.onsuccess = () => {
      const tx = req.result.transaction("keys", mode);
      const out = fn(tx.objectStore("keys"));
      tx.oncomplete = () => ok(out.result);
      tx.onerror = () => fail(tx.error);
    };
  });
}

function loadManifest(fresh) {
  if (fresh || !manifest) {
    manifest = fetch("/locks/manifest.json", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
  }
  return manifest;
}

function slugFor(path, m) {
  if (m.files[path]) return m.files[path];
  for (const [prefix, slug] of Object.entries(m.prefixes)) if (path.startsWith(prefix)) return slug;
  return null;
}

async function serve(request, url) {
  const m = await loadManifest(request.mode === "navigate");
  const slug = m && slugFor(url.pathname, m);
  if (!slug) return fetch(request);
  const key = await store("readonly", (s) => s.get(slug)).catch(() => null);
  if (!key) return fetch(request);
  const path = url.pathname.endsWith("/") ? `${url.pathname}index.html` : url.pathname;
  const res = await fetch(`${path}.enc`, { cache: request.mode === "navigate" ? "no-cache" : "default" });
  if (!res.ok) return fetch(request);
  const buf = new Uint8Array(await res.arrayBuffer());
  try {
    const body = await crypto.subtle.decrypt({ name: "AES-GCM", iv: buf.slice(0, 12) }, key, buf.slice(12));
    const ext = path.split(".").pop().toLowerCase();
    return new Response(body, { status: 200, headers: { "content-type": TYPES[ext] || "application/octet-stream" } });
  } catch {
    await store("readwrite", (s) => s.delete(slug)).catch(() => null);
    return fetch(request);
  }
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || event.request.method !== "GET") return;
  if (!url.pathname.startsWith("/projects/") && !url.pathname.startsWith("/_next/static/chunks/")) return;
  event.respondWith(serve(event.request, url));
});
