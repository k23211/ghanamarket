import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import VisitorTracker from "@/app/components/VisitorTracker";

export const metadata: Metadata = {
  title: "Vendoxa",
  description: "Vendoxa online marketplace in Ghana",
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
      </body>
    </html>
  );
}