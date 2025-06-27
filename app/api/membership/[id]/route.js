import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req, context) {
  try {
    const { id: projectId } = await context.params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const decoded = verifyToken(token);

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project tidak ditemukan" },
        { status: 404 }
      );
    }

    if (project.ownerId !== decoded.id) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const members = await prisma.membership.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(members);
  } catch (err) {
    console.error("GET /api/membership/[id] failed:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
