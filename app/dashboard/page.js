"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    if (!tokenFromStorage) return;

    setToken(tokenFromStorage);

    fetch("/api/projects", {
      headers: { Authorization: `Bearer ${tokenFromStorage}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
      });
  }, []);
  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleCreate = async () => {
    if (!name) return;

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    const newProject = await res.json();
    setProjects((prev) => [...prev, newProject]);
    setName("");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Button variant="destructive" onClick={handleLogout}>
        Logout
      </Button>
      <h1 className="text-2xl font-bold mb-6 text-center">Dashboard Project</h1>

      <div className="flex items-center gap-2 mb-6">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama Project Baru"
        />
        <Button onClick={handleCreate}>Buat Project</Button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="p-4">
              <Link
                href={`/projects/${project.id}`}
                className="text-blue-600 font-semibold hover:underline block mb-2"
              >
                {project.name}
              </Link>
              <div className="flex gap-4 text-sm text-gray-500">
                <Link
                  href={`/projects/${project.id}/settings`}
                  className="hover:underline"
                >
                  Pengaturan
                </Link>
                <Link
                  href={`/projects/${project.id}`}
                  className="hover:underline"
                >
                  Lihat Task
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
