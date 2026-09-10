import Header from './Header'
import BottomNav from './BottomNav'
import Sidebar from './Sidebar'

interface AppShellProps {
  children: React.ReactNode
  showBottomNav?: boolean
}

export default function AppShell({ children, showBottomNav = true }: AppShellProps) {
  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Desktop Left Sidebar (visible on md+) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-60">
        {/* Mobile Top Header (hidden on md+) */}
        <Header />

        <main className={`flex-1 ${showBottomNav ? 'pb-20 md:pb-8' : 'pb-8'}`}>
          {children}
        </main>

        {/* Mobile Bottom Nav (hidden on md+) */}
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  )
}

