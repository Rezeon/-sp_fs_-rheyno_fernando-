import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { signToken } from "@/lib/jwt";
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const token = signToken({ id: user.id });

  const cookieStore = cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ message: "Login success" });
}
