import AppShell from '@/components/layout/AppShell'
import { createClient } from '@/lib/supabase/server'
import type { Partner } from '@/lib/types'
import { defaultPartners } from '@/lib/partnersData'
import PartnersView from './PartnersView'

export const dynamic = 'force-dynamic'

export default async function PartnersPage() {
  let partnersData: Partner[] = defaultPartners

  try {
    const supabase = await createClient()
    const { data: partners } = await supabase
      .from('partners')
      .select('*')
      .order('display_order', { ascending: true })

    if (partners && partners.length > 0) {
      // Merge db data if available or use rich default partners
      partnersData = partners.map((p: Partner) => {
        const matched = defaultPartners.find(
          (dp: Partner) => dp.name.toLowerCase() === p.name.toLowerCase() || dp.id === p.id
        )
        return {
          ...p,
          acronym: matched?.acronym || p.acronym,
          region: matched?.region || p.region || 'Global',
          category: matched?.category || p.category || 'FOUNDATION',
          tags: matched?.tags || p.tags || [],
          since_year: matched?.since_year || p.since_year || '2020',
          contact_name: matched?.contact_name || p.contact_name,
          contact_email: matched?.contact_email || p.contact_email,
          contact_initials: matched?.contact_initials || p.contact_initials,
        }
      })
    }
  } catch {
    partnersData = defaultPartners
  }

  return (
    <AppShell showBottomNav={true}>
      <PartnersView initialPartners={partnersData} />
    </AppShell>
  )
}
