import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req, context) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = verifyToken(token);
    const { id: projectId } = await context.params;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project tidak ditemukan atau akses ditolak" },
        { status: 404 }
      );
    }
    const formattedMembers = project.members.map((m) => ({
      id: m.user.id,
      email: m.user.email,
    }));

    const formattedProject = {
      id: project.id,
      name: project.name,
      tasks: project.tasks,
      members: formattedMembers,
    };

    return NextResponse.json(formattedProject);
  } catch (error) {
    console.error("Error di route project:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });
  }

  const { id: projectId } = await params;

  try {
    const project = await prisma.project.findFirst({
      where: { id: projectId, ownerId: payload.id },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Unauthorized or Project not found" },
        { status: 403 }
      );
    }

    await prisma.task.deleteMany({
      where: { projectId },
    });

    await prisma.membership.deleteMany({
      where: { projectId },
    });

    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({ message: "Project berhasil dihapus" });
  } catch (err) {
    console.error("Gagal menghapus project:", err);
    return NextResponse.json(
      { error: "Gagal menghapus project" },
      { status: 500 }
    );
  }
}
