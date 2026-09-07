'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AppShell from '@/components/layout/AppShell'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError('Invalid email or password')
      setIsLoading(false)
      return
    }

    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <AppShell showBottomNav={false}>
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-6 shadow-sm animate-fade-in">
          {/* OAK Logo */}
          <div className="flex justify-center mb-5">
            <div className="bg-oak-navy px-4 py-2.5 rounded-xl shadow-sm">
              <Image
                src="/oak-foundation-logo.png"
                alt="Oak Foundation"
                width={120}
                height={42}
                className="h-7 w-auto object-contain"
                priority
              />
            </div>
          </div>

          <h1 className="text-xl font-bold text-oak-text text-center">Admin Login</h1>
          <p className="text-sm text-oak-text-muted text-center mt-1 mb-6">
            Coordination team access only
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-oak-text-muted uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@oakfoundation.org"
                className="form-input"
                required
                id="admin-email"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-oak-text-muted uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                required
                id="admin-password"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-oak-navy text-white py-3.5 rounded-xl font-semibold
                hover:bg-oak-navy-light transition-colors disabled:opacity-50"
              id="admin-login-btn"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  )
}
