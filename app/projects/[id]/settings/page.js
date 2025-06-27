"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InviteAutocomplete from "@/components/InviteAutocomplete";

export default function ProjectSettingsPage() {
  const { id: projectId } = useParams();
  const [email, setEmail] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    assigneeId: "",
  });
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(`/api/membership/${projectId}`);
        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setMembers(data);
        } else {
          setMembers([]);
          console.warn(data.error || "Gagal mengambil data member");
        }
      } catch (error) {
        console.error("Gagal fetch member:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchTasks = async () => {
      try {
        const res = await fetch(`/api/tasks/${projectId}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok) {
          setTasks(data);
        } else {
          console.warn(data.error || "Gagal mengambil task");
        }
      } catch (err) {
        console.error("Gagal fetch task:", err);
      }
    };

    if (projectId) {
      fetchMembers();
      fetchTasks();
    }
  }, [projectId]);

  const handleInvite = async () => {
    if (!email) return;

    try {
      const res = await fetch("/api/membership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ projectId, email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMembers((prev) => [...prev, data]);
        setEmail("");
      } else {
        alert(data.error || "Gagal mengundang member");
      }
    } catch (error) {
      console.error("Invite error:", error);
      alert("Terjadi kesalahan saat mengundang member.");
    }
  };
  const handleEditClick = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      assigneeId: task.assigneeId || "",
    });
  };

  const handleTaskUpdate = async () => {
    if (!selectedTask) return;

    try {
      const res = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: formData.status }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Status task berhasil diperbarui");
        setTasks((prev) => prev.map((t) => (t.id === data.id ? data : t)));
        setSelectedTask(null);
      } else {
        alert(data.error || "Gagal update status");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Terjadi kesalahan saat update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Yakin ingin menghapus task ini?")) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      } else {
        alert(data.error || "Gagal menghapus task");
      }
    } catch (err) {
      console.error("Delete task error:", err);
      alert("Terjadi kesalahan saat menghapus task");
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm("Yakin ingin menghapus project ini?")) return;

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        alert("Project berhasil dihapus");
        router.push("/dashboard");
      } else {
        alert(data.error || "Gagal menghapus project");
      }
    } catch (err) {
      console.error("Delete project error:", err);
      alert("Terjadi kesalahan saat menghapus project");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Pengaturan Project
      </h1>
      <div className="mt-10 text-center">
        <Button variant="destructive" onClick={handleDeleteProject}>
          Hapus Project
        </Button>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Undang Member</h2>
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            <InviteAutocomplete email={email} setEmail={setEmail} />
          </div>
          <Button onClick={handleInvite}>Undang</Button>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Daftar Member</h2>
        {loading ? (
          <p className="text-gray-600">Memuat...</p>
        ) : members.length > 0 ? (
          <ul className="space-y-2">
            {members.map((member) => (
              <li
                key={member.id}
                className="p-3 bg-white border rounded shadow"
              >
                {member.user?.email || "Email tidak tersedia"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">Belum ada member.</p>
        )}
      </div>
      <div className="mt-8">
        <h2 className="font-semibold mb-2">Daftar Task</h2>
        {tasks.length > 0 ? (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="p-3 bg-white border rounded shadow flex justify-between items-center"
              >
                <Card key={task.id} className="p-4 w-full">
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-gray-700">{task.description}</p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Status:</span> {task.status}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Assignee:</span>{" "}
                    {task.assignee?.email || "Unassigned"}
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEditClick(task)}>Edit</Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Hapus
                    </Button>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">Belum ada task.</p>
        )}
      </div>

      {selectedTask && (
        <div className="mt-8 p-4 border rounded bg-gray-50">
          <h2 className="font-semibold mb-2">Edit Task</h2>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button onClick={handleTaskUpdate}>Update</Button>
              <Button variant="outline" onClick={() => setSelectedTask(null)}>
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
