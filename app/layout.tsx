"use client";

import React, { useEffect } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { trackUniqueVisit } from "../utils/trackVisitor";

export const metadata: Metadata = {
  title: "GhanaMarket",
  description: "Ghana e-commerce store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    void trackUniqueVisit();
  }, []);
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}