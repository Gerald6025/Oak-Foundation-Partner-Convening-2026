import AppShell from '@/components/layout/AppShell'
import ProgrammeView from './ProgrammeView'

export const dynamic = 'force-dynamic'

export default function ProgrammePage() {
  return (
    <AppShell showBottomNav={true}>
      <ProgrammeView />
    </AppShell>
  )
}
