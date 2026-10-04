// Lock page script (pages written by scripts/protect.mjs). Derives the project's key from
// the password, checks it against the manifest, keeps it in IndexedDB as a non-extractable
// key, and registers /lock-sw.js, which decrypts the project's files from then on.
(() => {
  const slug = document.body.dataset.slug;
  const form = document.querySelector("form");
  const msg = document.getElementById("msg");
  const button = form.querySelector("button");
  const bytes = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

  if (!("serviceWorker" in navigator) || !window.crypto || !crypto.subtle || !window.indexedDB) {
    msg.textContent = "This browser can't unlock the page.";
    button.disabled = true;
    return;
  }

  const save = (key) =>
    new Promise((ok, fail) => {
      const req = indexedDB.open("locks", 1);
      req.onupgradeneeded = () => req.result.createObjectStore("keys");
      req.onerror = () => fail(req.error);
      req.onsuccess = () => {
        const tx = req.result.transaction("keys", "readwrite");
        tx.objectStore("keys").put(key, slug);
        tx.oncomplete = () => ok();
        tx.onerror = () => fail(tx.error);
      };
    });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    button.disabled = true;
    msg.textContent = "Checking…";
    try {
      const manifest = await (await fetch("/locks/manifest.json", { cache: "no-cache" })).json();
      const lock = manifest.slugs[slug];
      const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(form.pw.value), "PBKDF2", false, ["deriveKey"]);
      const key = await crypto.subtle.deriveKey(
        { name: "PBKDF2", hash: "SHA-256", salt: bytes(lock.salt), iterations: manifest.iter },
        base, { name: "AES-GCM", length: 256 }, false, ["decrypt"],
      );
      const check = bytes(lock.check);
      try {
        await crypto.subtle.decrypt({ name: "AES-GCM", iv: check.slice(0, 12) }, key, check.slice(12));
      } catch {
        msg.textContent = "Wrong password.";
        button.disabled = false;
        form.pw.select();
        return;
      }
      await save(key);
      await navigator.serviceWorker.register("/lock-sw.js", { scope: "/" });
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller) {
        await new Promise((ok) => navigator.serviceWorker.addEventListener("controllerchange", ok, { once: true }));
      }
      location.reload();
    } catch (err) {
      msg.textContent = `Couldn't unlock: ${err.message}`;
      button.disabled = false;
    }
  });
})();
