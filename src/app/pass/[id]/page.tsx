import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import AppShell from '@/components/layout/AppShell'
import PassView from './PassView'
import { getAttendeeOverride } from '@/lib/attendee-overrides'

interface PassPageProps {
  params: Promise<{ id: string }>
}

export default async function PassPage({ params }: PassPageProps) {
  const { id } = await params
  const supabase = createAdminClient()

  // Fetch non-sensitive fields
  const { data: attendee, error } = await supabase
    .from('attendees')
    .select('id, first_name, last_name, full_name, organization, role, email, qr_code_token, created_at')
    .eq('id', id)
    .single()

  if (error || !attendee) {
    notFound()
  }

  // Apply any registered role/details override (ensures re-registered roles like Partner take precedence)
  const override = getAttendeeOverride(id) || (attendee.email ? getAttendeeOverride(attendee.email) : null) || (attendee.qr_code_token ? getAttendeeOverride(attendee.qr_code_token) : null)
  if (override) {
    if (override.role) attendee.role = override.role
    if (override.organization) attendee.organization = override.organization
    if (override.first_name) attendee.first_name = override.first_name
    if (override.last_name) attendee.last_name = override.last_name
    if (override.full_name) attendee.full_name = override.full_name
    if (override.qr_code_token) attendee.qr_code_token = override.qr_code_token
  }

  // Presenters do not receive QR codes for attendance check-in
  const isPresenter = attendee.role?.toLowerCase() === 'presenter'
  if (isPresenter) {
    return (
      <AppShell showBottomNav={true}>
        <div className="w-full flex flex-col items-center px-4 pt-8 pb-24">
          <div className="w-[370px] max-w-full bg-white rounded-[26px] p-6 text-center shadow-sm border border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3.5 text-2xl border border-amber-200">
              ℹ️
            </div>
            <h1 className="text-lg font-black text-[#0F172A]">
              QR Code Pass Not Required
            </h1>
            <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
              Per event guidelines, Presenters are not required to check in with a QR code. As a registered <strong>Presenter</strong>, you have direct access to the Programme and Partner directory.
            </p>
            <a
              href="/programme"
              className="mt-5 inline-block w-full bg-[#162E55] hover:bg-[#1E3A68] text-white py-3.5 rounded-[16px] font-bold text-xs shadow-md shadow-[#162E55]/20 transition-all text-center"
            >
              Go to Programme
            </a>
          </div>
        </div>
      </AppShell>
    )
  }

  // Observers do not have QR codes generated
  const isObserver = attendee.role?.toLowerCase() === 'observer'
  if (isObserver) {
    return (
      <AppShell showBottomNav={true}>
        <div className="w-full flex flex-col items-center px-4 pt-8 pb-24">
          <div className="w-[370px] max-w-full bg-white rounded-[26px] p-6 text-center shadow-sm border border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3.5 text-2xl border border-blue-200">
              ℹ️
            </div>
            <h1 className="text-lg font-black text-[#0F172A]">
              No QR Code Required
            </h1>
            <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
              Per event guidelines, Observers do not receive QR check-in codes. As a registered <strong>Observer</strong>, you have direct access to the Programme and Partner directory.
            </p>
            <a
              href="/programme"
              className="mt-5 inline-block w-full bg-[#162E55] hover:bg-[#1E3A68] text-white py-3.5 rounded-[16px] font-bold text-xs shadow-md shadow-[#162E55]/20 transition-all text-center"
            >
              Go to Programme
            </a>
          </div>
        </div>
      </AppShell>
    )
  }

  // Coordination Team members do not have QR codes generated
  const isCoordinationTeam = attendee.role?.toLowerCase() === 'coordination team'
  if (isCoordinationTeam) {
    return (
      <AppShell showBottomNav={true}>
        <div className="w-full flex flex-col items-center px-4 pt-8 pb-24">
          <div className="w-[370px] max-w-full bg-white rounded-[26px] p-6 text-center shadow-sm border border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3.5 text-2xl border border-indigo-200">
              📋
            </div>
            <h1 className="text-lg font-black text-[#0F172A]">
              Coordination Team Member
            </h1>
            <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
              No QR code is required. As a registered member of the <strong>Coordination Team</strong>, you have direct access to the Check-In Scanner, Attendance Dashboard, Programme, and Partners directory.
            </p>
            <a
              href="/admin/dashboard"
              className="mt-5 inline-block w-full bg-[#162E55] hover:bg-[#1E3A68] text-white py-3.5 rounded-[16px] font-bold text-xs shadow-md shadow-[#162E55]/20 transition-all text-center"
            >
              Go to Coordination Dashboard
            </a>
          </div>
        </div>
      </AppShell>
    )
  }

  // Ensure qr_code_token is never empty
  if (!attendee.qr_code_token) {
    const newToken = `OAK-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    await supabase.from('attendees').update({ qr_code_token: newToken }).eq('id', id)
    attendee.qr_code_token = newToken
  }

  return (
    <AppShell showBottomNav={true}>
      <PassView attendee={attendee} />
    </AppShell>
  )
}
