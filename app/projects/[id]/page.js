"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import socket from "@/lib/socket-server";

export default function ProjectTasksPage() {
  const { id: projectId } = useParams();
  const [projectName, setProjectName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [members, setMembers] = useState([]);
  const [assigneeId, setAssigneeId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectId) return;

    fetch(`/api/projects/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.name && data.members) {
          setProjectName(data.name);
          setMembers(data.members);
        } else {
          setProjectName("Tidak Diketahui");
        }
      });

    fetch(`/api/tasks/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTasks(data);
          setError("");
        } else {
          setTasks([]);
          setError(data.error || "Gagal mengambil task");
        }
      });

    socket.connect();
    socket.emit("join", projectId);

    socket.on("task:created", (task) => {
      if (task.projectId === projectId) {
        setTasks((prev) => [...prev, task]);
      }
    });

    return () => {
      socket.off("task:created");
      socket.disconnect();
    };
  }, [projectId]);

  const handleCreateTask = async () => {
    if (!title || !description) {
      alert("Judul dan deskripsi wajib diisi");
      return;
    }

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId,
        title,
        description,
        status,
        assigneeId,
      }),
    });

    if (!res.ok) {
      alert("Gagal membuat task");
      return;
    }

    const newTask = await res.json();
    socket.emit("task:create", newTask);

    setTitle("");
    setDescription("");
    setStatus("todo");
    setAssigneeId("");
    alert("Task berhasil dibuat");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        📋 Tasks untuk Project: {projectName}
      </h1>

      <div className="space-y-4 mb-8">
        <div className="flex flex-col gap-1">
          <Label>Judul Task</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Deskripsi</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task Description"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <Label>Assignee</Label>
          <Select value={assigneeId} onValueChange={setAssigneeId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih assignee" />
            </SelectTrigger>
            <SelectContent>
              {members.length === 0 ? (
                <div className="text-sm text-gray-500 px-2 py-1">
                  Tidak ada member
                </div>
              ) : (
                members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.email}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleCreateTask}>Tambah Task</Button>
      </div>

      <h2 className="text-xl font-semibold mb-4">📌 Daftar Tasks</h2>

      {tasks.length === 0 ? (
        <p className="text-gray-600 italic">Belum ada task</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="p-4">
              <div className="mb-2 text-sm text-gray-400">
                ID: {task.id?.slice(0, 8)}...
              </div>
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-gray-700">{task.description}</p>
              <p className="text-sm mt-1">
                <span className="font-medium">Status:</span> {task.status}
              </p>
              <p className="text-sm">
                <span className="font-medium">Assignee:</span>{" "}
                {task.assignee?.email || "Unassigned"}
              </p>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
}
