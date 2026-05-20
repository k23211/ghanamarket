"use client";

import { useEffect } from "react";
import { trackUniqueVisit } from "@/utils/trackVisitor";

export default function VisitorTracker() {
  useEffect(() => {
    void trackUniqueVisit();
  }, []);

  return null;
}
