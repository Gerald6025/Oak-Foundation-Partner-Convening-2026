import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import AppShell from '@/components/layout/AppShell'
import PassView from './PassView'

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

  return (
    <AppShell showBottomNav={true}>
      <PassView attendee={attendee} />
    </AppShell>
  )
}
