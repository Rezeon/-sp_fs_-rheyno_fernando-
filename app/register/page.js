'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi tidak cocok')
      return
    }

    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      alert('Berhasil register, silakan login')
      router.push('/login')
    } else {
      setError(data.error || 'Gagal register')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

          {error && (
            <div className="text-red-600 mb-4 text-sm text-center">{error}</div>
          )}

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mb-4"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mb-4"
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="mb-6"
          />
          <Link href={`/login`} className="hover:underline mb-2">
          Login?
          </Link>
          <Button
            onClick={handleRegister}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Mendaftarkan...' : 'Register'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
