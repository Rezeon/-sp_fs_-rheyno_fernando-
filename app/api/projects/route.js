import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req) {
  const { name } = await req.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: userId } = verifyToken(token);

  const project = await prisma.project.create({
    data: {
      name,
      ownerId: userId,
      members: {
        create: {
          userId,
        },
      },
    },
  });

  return NextResponse.json(project);
}

export async function GET(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: userId } = verifyToken(token);

  const projects = await prisma.project.findMany({
    where: {
      OR: [{ ownerId: userId }, { members: { some: { userId } } }],
    },
    include: {
      members: true,
    },
  });

  return NextResponse.json(projects);
}
