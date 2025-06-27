// src/components/LogoutButton.js
"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/logout";

export default function LogoutButton() {
  return (
    <Button variant="destructive" onClick={logout}>
      Logout
    </Button>
  );
}
