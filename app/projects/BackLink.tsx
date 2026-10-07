"use client";

import { usePathname } from "next/navigation";

/** Back to the Work page from a write-up or story, and to the homepage from the Work page itself. */
export default function BackLink() {
  const inside = /^\/projects\/[^/]+/.test(usePathname() ?? "");
  return (
    <a href={inside ? "/projects/" : "/"} className="write-up-back">
      {inside ? "← work" : "← shel."}
    </a>
  );
}
