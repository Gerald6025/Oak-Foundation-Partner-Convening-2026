import AppShell from '@/components/layout/AppShell'
import { createClient } from '@/lib/supabase/server'
import type { Partner } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function PartnersPage() {
  const supabase = await createClient()

  const { data: partners } = await supabase
    .from('partners')
    .select('*')
    .order('display_order', { ascending: true })

  const hasData = partners && partners.length > 0

  // Placeholder partners if no data
  const placeholderPartners: Partner[] = [
    { id: '1', name: 'Open Society Foundations', description: 'Advancing justice, education, and public health worldwide', website_url: 'https://opensocietyfoundations.org', logo_url: null, display_order: 1, is_sub_partner: false, parent_partner_id: null, created_at: '' },
    { id: '2', name: 'Ford Foundation', description: 'Working to reduce poverty and injustice', website_url: 'https://fordfoundation.org', logo_url: null, display_order: 2, is_sub_partner: false, parent_partner_id: null, created_at: '' },
    { id: '3', name: 'Hivos', description: 'People-powered innovation and change', website_url: 'https://hivos.org', logo_url: null, display_order: 3, is_sub_partner: false, parent_partner_id: null, created_at: '' },
    { id: '4', name: 'Oxfam International', description: 'Fighting inequality to end poverty', website_url: 'https://oxfam.org', logo_url: null, display_order: 4, is_sub_partner: false, parent_partner_id: null, created_at: '' },
    { id: '5', name: 'ActionAid', description: 'Fighting poverty and injustice worldwide', website_url: 'https://actionaid.org', logo_url: null, display_order: 5, is_sub_partner: false, parent_partner_id: null, created_at: '' },
    { id: '6', name: 'Uncommon.org', description: 'Education, Technology, Purpose', website_url: 'https://uncommon.org', logo_url: null, display_order: 6, is_sub_partner: false, parent_partner_id: null, created_at: '' },
  ]

  const displayPartners = hasData ? (partners as Partner[]) : placeholderPartners

  // Separate main partners and sub-partners
  const mainPartners = displayPartners.filter((p) => !p.is_sub_partner)
  const subPartners = displayPartners.filter((p) => p.is_sub_partner)

  return (
    <AppShell>
      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-oak-text">Partners</h1>
        <p className="text-sm text-oak-text-muted mt-1">
          OAK Foundation partner organizations
        </p>

        {/* Main Partners */}
        <div className="mt-6 space-y-3">
          {mainPartners.map((partner, index) => (
            <PartnerCard key={partner.id} partner={partner} index={index} />
          ))}
        </div>

        {/* Sub-Partners */}
        {subPartners.length > 0 && (
          <>
            <h2 className="text-xs font-semibold text-oak-text-muted uppercase tracking-wider mt-8 mb-3">
              Sub-Partners & Programme Areas
            </h2>
            <div className="space-y-3">
              {subPartners.map((partner, index) => (
                <PartnerCard key={partner.id} partner={partner} index={index} />
              ))}
            </div>
          </>
        )}

        {!hasData && (
          <p className="text-xs text-oak-text-muted text-center mt-6 italic">
            Showing placeholder partners. Actual partner data will be loaded before the event.
          </p>
        )}
      </div>
    </AppShell>
  )
}

function PartnerCard({ partner, index }: { partner: Partner; index: number }) {
  const initials = partner.name
    .split(' ')
    .map((w) => w.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const colors = [
    'bg-blue-600',
    'bg-emerald-600',
    'bg-purple-600',
    'bg-amber-600',
    'bg-rose-600',
    'bg-cyan-600',
  ]
  const bgColor = colors[index % colors.length]

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
      <div className="flex items-center gap-3">
        {partner.logo_url ? (
          <img
            src={partner.logo_url}
            alt={partner.name}
            className="w-12 h-12 rounded-xl object-contain bg-oak-gray-50 p-1"
          />
        ) : (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm ${bgColor}`}>
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-oak-text truncate">{partner.name}</h3>
          {partner.description && (
            <p className="text-xs text-oak-text-muted mt-0.5 line-clamp-2">{partner.description}</p>
          )}
        </div>
        {partner.website_url && (
          <a
            href={partner.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-9 h-9 bg-oak-gray-50 rounded-lg flex items-center justify-center
              hover:bg-oak-gray-100 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}
