import Header from './Header'
import BottomNav from './BottomNav'

interface AppShellProps {
  children: React.ReactNode
  showBottomNav?: boolean
}

export default function AppShell({ children, showBottomNav = true }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-oak-cream">
      <Header />
      <main className={`flex-1 ${showBottomNav ? 'pb-20' : ''}`}>
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  )
}
