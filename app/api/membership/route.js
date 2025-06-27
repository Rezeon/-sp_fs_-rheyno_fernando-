import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { projectId, email } = await req.json(); 

    const cookieStore = await cookies(); 
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: requesterId } = verifyToken(token);

    const userToInvite = await prisma.user.findUnique({ where: { email } });

    if (!userToInvite) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.ownerId !== requesterId) {
      return NextResponse.json({ error: "Akses ditolak hanya pemilik yang bisa mengundang" }, { status: 403 });
    }

    const existingMember = await prisma.membership.findFirst({
      where: {
        userId: userToInvite.id,
        projectId,
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "User sudah menjadi member" },
        { status: 400 }
      );
    }

    const member = await prisma.membership.create({
      data: {
        projectId,
        userId: userToInvite.id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error("POST /api/membership error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
