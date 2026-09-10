'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import { registrationSchema, type RegistrationInput } from '@/lib/validators'

const roleOptions = [
  'Partner',
  'OAK Staff',
  'Coordination Team',
  'Presenter',
  'Observer',
]

export default function RegisterPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      consent_given: false,
    },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: RegistrationInput) => {
    setIsSubmitting(true)
    setServerError('')

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        setServerError(result.error || 'Registration failed. Please try again.')
        return
      }

      // Persist active role for permission checks and navigation
      document.cookie = `user_role=${encodeURIComponent(data.role)}; path=/; max-age=2592000; SameSite=Lax`
      try {
        localStorage.setItem('user_role', data.role)
      } catch {}

      // Role-based workflow redirection:
      // - Coordination Team: Coordination Team Dashboard
      // - Presenter: Programme (no QR check-in pass)
      // - Observer: Programme (platform dashboard, no QR pass)
      // - Partner: Straight to QR Code Entry Pass
      if (data.role === 'Coordination Team') {
        window.location.href = '/admin/dashboard'
        return
      } else if (data.role === 'Presenter' || data.role === 'Observer') {
        window.location.href = '/programme'
        return
      } else if (data.role === 'Partner') {
        window.location.href = `/pass/${result.id}`
        return
      } else {
        window.location.href = '/programme'
        return
      }
    } catch {
      setServerError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell showBottomNav={false}>
      <div className="w-full flex flex-col items-center px-4 pt-3 pb-8">
        {/* ─── Hero Banner Card ─── */}
        <div className="w-[370px] max-w-full h-[167px] bg-gradient-to-b from-[#1C3663] to-[#142646] rounded-[26px] p-6 shadow-md relative overflow-hidden flex flex-col justify-center text-left">
          <h1 className="text-[27px] font-extrabold text-white leading-[1.18] tracking-tight">
            Partner<br />Convening 2026
          </h1>
          <p className="text-white/60 text-xs mt-2.5 font-normal">
            Harare · 9–11 November 2026
          </p>
        </div>

        {/* ─── Stats Row ─── */}
        <div className="w-[370px] max-w-full grid grid-cols-3 gap-2.5 mt-3">
          <MiniStat
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
            value="110+"
            label="Attendees"
          />
          <MiniStat
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
            value="24"
            label="Sessions"
          />
          <MiniStat
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            }
            value="38"
            label="Partners"
          />
        </div>

        {/* ─── Registration Form Card ─── */}
        <div className="w-[370px] max-w-full bg-white rounded-[26px] p-5 sm:p-6 shadow-sm border border-slate-100/80 mt-4">
          <h2 className="text-[19px] font-extrabold text-[#0F172A] mb-5">
            Registration Form
          </h2>

          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl mb-5 text-xs">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-2.5">
              <FormField
                label="FIRST NAME"
                required
                error={errors.first_name?.message}
              >
                <input
                  {...register('first_name')}
                  type="text"
                  placeholder="Maria"
                  className="w-full px-3.5 py-2.5 bg-[#EEF2F6] border-0 rounded-[14px] text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#162E55]/25 transition-all"
                  id="first_name"
                />
              </FormField>
              <FormField
                label="LAST NAME"
                required
                error={errors.last_name?.message}
              >
                <input
                  {...register('last_name')}
                  type="text"
                  placeholder="Schmidt"
                  className="w-full px-3.5 py-2.5 bg-[#EEF2F6] border-0 rounded-[14px] text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#162E55]/25 transition-all"
                  id="last_name"
                />
              </FormField>
            </div>

            {/* Organisation */}
            <FormField
              label="ORGANISATION"
              required
              error={errors.organization?.message}
            >
              <input
                {...register('organization')}
                type="text"
                placeholder="Your organisation name"
                className="w-full px-3.5 py-2.5 bg-[#EEF2F6] border-0 rounded-[14px] text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#162E55]/25 transition-all"
                id="organization"
              />
            </FormField>

            {/* Sub-Partner / Programme Area */}
            <FormField
              label="SUB-PARTNER / PROGRAMME AREA"
              error={errors.sub_partner?.message}
            >
              <input
                {...register('sub_partner')}
                type="text"
                placeholder="Optional"
                className="w-full px-3.5 py-2.5 bg-[#EEF2F6] border-0 rounded-[14px] text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#162E55]/25 transition-all"
                id="sub_partner"
              />
            </FormField>

            {/* Role / Capacity */}
            <FormField
              label="ROLE / CAPACITY"
              required
              error={errors.role?.message}
            >
              <div className="relative">
                <select
                  {...register('role')}
                  className="w-full px-3.5 py-2.5 bg-[#EEF2F6] border-0 rounded-[14px] text-sm text-[#1E293B] appearance-none focus:outline-none focus:ring-2 focus:ring-[#162E55]/25 transition-all cursor-pointer pr-10"
                  id="role"
                  defaultValue=""
                >
                  <option value="" disabled className="text-[#94A3B8]">
                    Select your role
                  </option>
                  {roleOptions.map((role) => (
                    <option key={role} value={role} className="text-[#1E293B]">
                      {role}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#64748B]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </FormField>

            {/* Email */}
            <FormField
              label="EMAIL ADDRESS"
              required
              error={errors.email?.message}
            >
              <input
                {...register('email')}
                type="email"
                placeholder="you@organisation.org"
                className="w-full px-3.5 py-2.5 bg-[#EEF2F6] border-0 rounded-[14px] text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#162E55]/25 transition-all"
                id="email"
              />
            </FormField>

            {/* Phone */}
            <FormField
              label="PHONE NUMBER"
              error={errors.phone?.message}
            >
              <input
                {...register('phone')}
                type="tel"
                placeholder="+41 xx xxx xx xx"
                className="w-full px-3.5 py-2.5 bg-[#EEF2F6] border-0 rounded-[14px] text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#162E55]/25 transition-all"
                id="phone"
              />
            </FormField>

            {/* Requirements Box */}
            <div className="bg-[#EEF2F6] rounded-[18px] p-3.5 space-y-3">
              <h3 className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                Requirements
              </h3>

              <div>
                <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Dietary Requirements
                </label>
                <input
                  {...register('dietary_requirements')}
                  type="text"
                  placeholder="e.g. Vegetarian, Halal, Gluten-free"
                  className="w-full px-3 py-2 bg-white border-0 rounded-[12px] text-xs text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#162E55]/25 transition-all"
                  id="dietary_requirements"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Accessibility Requirements
                </label>
                <input
                  {...register('accessibility_needs')}
                  type="text"
                  placeholder="e.g. Wheelchair access, hearing loop"
                  className="w-full px-3 py-2 bg-white border-0 rounded-[12px] text-xs text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#162E55]/25 transition-all"
                  id="accessibility_needs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Travel Requirements
                </label>
                <input
                  {...register('travel_needs')}
                  type="text"
                  placeholder="e.g. Flight from London, airport transfer needed"
                  className="w-full px-3 py-2 bg-white border-0 rounded-[12px] text-xs text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#162E55]/25 transition-all"
                  id="travel_needs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Accommodation Requirements
                </label>
                <input
                  {...register('accommodation_needs')}
                  type="text"
                  placeholder="e.g. Hotel reservation, accessible room required"
                  className="w-full px-3 py-2 bg-white border-0 rounded-[12px] text-xs text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#162E55]/25 transition-all"
                  id="accommodation_needs"
                />
              </div>
            </div>

            {/* Consent Box */}
            <div className="border border-[#E2E8F0] rounded-[16px] p-3.5 bg-white">
              <label className="flex items-start gap-2.5 cursor-pointer" htmlFor="consent_given">
                <input
                  {...register('consent_given')}
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded border-[#CBD5E1] text-[#162E55] focus:ring-[#162E55] flex-shrink-0"
                  id="consent_given"
                />
                <span className="text-[11px] text-[#475569] leading-relaxed">
                  I agree to OAK Foundation&apos;s{' '}
                  <span className="underline text-[#162E55] font-medium">privacy policy</span>{' '}
                  and consent to my registration data being used for event coordination.
                </span>
              </label>
              {errors.consent_given && (
                <p className="text-red-500 text-[11px] mt-1.5">{errors.consent_given.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1E3A68] hover:bg-[#162E55] text-white py-3.5 rounded-[16px] font-bold text-sm tracking-wide shadow-md shadow-[#162E55]/20 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              id="submit-registration"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Registering...
                </span>
              ) : (
                'Register'
              )}
            </button>
          </form>
        </div>

        {/* GDPR Note */}
        <p className="w-[370px] max-w-full text-[10px] text-[#94A3B8] text-center mt-1 leading-normal px-4">
          Your data is secured and handled by OAK Foundation in accordance with GDPR.
        </p>
      </div>
    </AppShell>
  )
}

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1 flex items-center">
        <span>{label}</span>
        {required && <span className="text-[#EF4444] ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-[11px] mt-1">{error}</p>}
    </div>
  )
}

function MiniStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-white rounded-[20px] p-3.5 shadow-sm border border-slate-100/80 text-left flex flex-col justify-between">
      <div className="mb-2 text-[#64748B]">{icon}</div>
      <div>
        <div className="text-[19px] font-black text-[#0F172A] leading-none">{value}</div>
        <div className="text-[11px] font-medium text-[#64748B] mt-1">{label}</div>
      </div>
    </div>
  )
}
