"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Section = { id: string; label: string };

/**
 * The write-up's sections as a left sidebar on wide screens. Read from the article's own h2s
 * after render, so every write-up gets it without listing its sections twice, and a locked
 * write-up gets it once its text is decrypted. Hidden on the index, on stories, and on pages
 * with too few sections to need one.
 */
export default function WriteupToc() {
  const path = usePathname();
  const isWriteup = /^\/projects\/[^/]+\/?$/.test(path ?? "");
  const [sections, setSections] = useState<Section[]>([]);
  const [active, setActive] = useState<string>();

  useEffect(() => {
    if (!isWriteup) return setSections([]);
    const article = document.querySelector("article");
    if (!article) return;
    const read = () => {
      const heads = [...article.querySelectorAll<HTMLHeadingElement>(":scope > h2, :scope > section > h2")];
      const next = heads.map((h) => {
        if (!h.id) h.id = slug(h.textContent ?? "");
        return { id: h.id, label: h.textContent ?? "" };
      });
      setSections((prev) => (same(prev, next) ? prev : next));
    };
    read();
    const watch = new MutationObserver(read);
    watch.observe(article, { childList: true, subtree: true });
    return () => watch.disconnect();
  }, [isWriteup, path]);

  useEffect(() => {
    if (!sections.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      // Same rule as the Work page's tags: the last section whose top has passed a third of the way down.
      const line = window.innerHeight / 3;
      let current = sections[0].id;
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [sections]);

  if (sections.length < 3) return null;
  return (
    <nav className="writeup-toc" aria-label="Sections">
      <span className="writeup-toc-label">Contents</span>
      <ol>
        {sections.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className={s.id === active ? "is-active" : undefined} aria-current={s.id === active ? "location" : undefined}>
              {s.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

const same = (a: Section[], b: Section[]) => a.length === b.length && a.every((s, i) => s.id === b[i].id && s.label === b[i].label);
