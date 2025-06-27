"use client";

import { useEffect } from "react";

export default function UseClient() {
  useEffect(() => {
    fetch("/api/socket");
  }, []);

  return null;
}
