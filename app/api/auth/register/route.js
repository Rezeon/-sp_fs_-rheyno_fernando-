import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 })
  }

  const hashedPassword = await hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  })

  return NextResponse.json({ message: 'Berhasil register', user })
}
