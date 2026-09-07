import AppShell from '@/components/layout/AppShell'
import { createClient } from '@/lib/supabase/server'
import { defaultPartners, getPartnerById } from '@/lib/partnersData'
import PartnerDetailView from './PartnerDetailView'

export const dynamic = 'force-dynamic'

interface PartnerPageProps {
  params: Promise<{ id: string }>
}

export default async function PartnerPage({ params }: PartnerPageProps) {
  const { id } = await params

  let partner = getPartnerById(id)

  try {
    const supabase = await createClient()
    const { data: dbPartner } = await supabase
      .from('partners')
      .select('*')
      .eq('id', id)
      .single()

    if (dbPartner) {
      const matched = defaultPartners.find(
        (dp) => dp.name.toLowerCase() === dbPartner.name.toLowerCase() || dp.id === dbPartner.id
      )
      partner = {
        ...dbPartner,
        acronym: matched?.acronym || dbPartner.acronym,
        region: matched?.region || dbPartner.region || 'Global',
        category: matched?.category || dbPartner.category || 'FOUNDATION',
        tags: matched?.tags || dbPartner.tags || [],
        since_year: matched?.since_year || dbPartner.since_year || '2020',
        contact_name: matched?.contact_name || 'Maria Schmidt',
        contact_initials: matched?.contact_initials || 'MS',
        contact_email: matched?.contact_email || 'contact@partner.org',
        description: dbPartner.description || matched?.description,
      }
    }
  } catch {
    // Fall back to matched mock/default partner
  }

  if (!partner) {
    partner = defaultPartners[0]
  }

  return (
    <AppShell showBottomNav={true}>
      <PartnerDetailView partner={partner} />
    </AppShell>
  )
}
