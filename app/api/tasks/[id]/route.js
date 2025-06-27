import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { getIO } from "@/lib/socket-server";
import { cookies } from "next/headers";

export async function GET(req, context) {
  const { id: projectId } = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token);

    const isMember = await prisma.membership.findFirst({
      where: { projectId, userId: decoded.id },
    });

    const isOwner = await prisma.project.findFirst({
      where: { id: projectId, ownerId: decoded.id },
    });

    if (!isMember && !isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: { assignee: { select: { id: true, email: true } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(tasks);
  } catch (err) {
    return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
  }
}

export async function PATCH(req, { params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { title, description, status, assigneeId } = body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        assigneeId,
      },
      include: {
        assignee: true,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (err) {
    console.error("Update task error:", err);
    return NextResponse.json({ error: "Gagal mengupdate task" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const deletedTask = await prisma.task.delete({
      where: { id },
    });
    

    return NextResponse.json({ message: "Task berhasil dihapus", id });
  } catch (err) {
    console.error("Delete task error:", err);
    return NextResponse.json({ error: "Gagal menghapus task" }, { status: 500 });
  }
}