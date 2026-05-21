import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import VisitorTracker from "@/app/components/VisitorTracker";
import HelpWidget from "@/app/components/HelpWidget";

export const metadata: Metadata = {
  title: "Ghanamarket",
  description: "Ghanamarket online marketplace in Ghana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <VisitorTracker />
        {children}
        <HelpWidget />
      </body>
    </html>
  );
}