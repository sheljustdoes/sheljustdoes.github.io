import type { Metadata } from "next";
import "./globals.css";
import { HEADLINE } from "@/lib/resume";

export const metadata: Metadata = {
  title: "shel.",
  description: `Shel Burkes, PhD, ${HEADLINE.title}`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // suppressHydrationWarning covers attributes that browser extensions add before
  // React hydrates. It only suppresses the element's own attributes, one level deep,
  // so real mismatches inside the app still surface — which is why it is applied to
  // <html> and <body> individually rather than wrapping the tree.
  //
  // Seen on html: class="hentry", from microformat-injecting extensions.
  // Seen on body: cz-shortcut-listen (ColorZilla), data-rm-theme, inmaintabuse.
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
