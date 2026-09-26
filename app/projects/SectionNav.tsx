"use client";

import { useEffect, useRef, useState } from "react";

export type NavItem = { id: string; label: string };

/**
 * Persistent section tags for the Work page. Each tag is a plain anchor, so
 * jumping works without JavaScript; the script only marks which section the
 * reader is in, which is the question the page otherwise leaves open.
 */
export default function SectionNav({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const navRef = useRef<HTMLElement>(null);

  // On a narrow screen the bar scrolls sideways; keep the active tag in view.
  // Scrolls the bar only, never the page.
  useEffect(() => {
    const nav = navRef.current;
    const tag = nav?.querySelector<HTMLElement>("a.is-active");
    if (!nav || !tag) return;
    const left = tag.offsetLeft - nav.offsetLeft;
    const right = left + tag.offsetWidth;
    if (left < nav.scrollLeft || right > nav.scrollLeft + nav.clientWidth) {
      nav.scrollTo({ left: left - (nav.clientWidth - tag.offsetWidth) / 2, behavior: "smooth" });
    }
  }, [active]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      // The current section is the last one whose top has passed a line a
      // third of the way down the viewport; at the very bottom, the last one.
      const line = window.innerHeight / 3;
      let current = items[0]?.id;
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      setActive(atBottom ? items[items.length - 1]?.id : current);
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
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav ref={navRef} className="section-nav" aria-label="Sections">
      {items.map(({ id, label }) => (
        <a key={id} href={`#${id}`} className={id === active ? "is-active" : undefined} aria-current={id === active ? "true" : undefined}>
          {label}
        </a>
      ))}
    </nav>
  );
}
