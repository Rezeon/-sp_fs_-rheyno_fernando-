import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { getIO } from "@/lib/socket-server";
import { cookies } from "next/headers";

export async function POST(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: userId } = verifyToken(token);
  const { title, description, status, projectId, assigneeId } =
    await req.json();

  try {
    const isMember = await prisma.membership.findFirst({
      where: { projectId, userId },
    });

    const isOwner = await prisma.project.findFirst({
      where: { id: projectId, ownerId: userId },
    });

    if (!isMember && !isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        projectId,
        assigneeId,
      },
      include: {
        assignee: { select: { id: true, email: true } },
      },
    });

    try {
      const io = getIO();
      io.emit("task:created", newTask);
    } catch (err) {
      console.warn("Socket not initialized:", err.message);
    }

    return NextResponse.json(newTask);
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
