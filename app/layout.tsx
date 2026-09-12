import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "shel.",
  description: "Shel Burkes, PhD — Principal Applied Scientist",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
