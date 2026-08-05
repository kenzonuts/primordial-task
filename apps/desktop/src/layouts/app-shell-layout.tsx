import { Outlet } from 'react-router-dom'

import { Sidebar } from '@/components/navigation/sidebar'
import { TopNavigation } from '@/components/navigation/top-navigation'
import { useAppStore } from '@/stores/app-store'

export function AppShellLayout() {
  const rightPanelOpen = useAppStore((state) => state.rightPanelOpen)
  const toggleRightPanelOpen = useAppStore((state) => state.toggleRightPanelOpen)

  return (
    <div className="flex min-h-screen min-w-[1024px] bg-zinc-900 text-zinc-100">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavigation onToggleRightPanel={toggleRightPanelOpen} />

        <div className="flex min-h-0 flex-1">
          <main className="flex-1 p-6" aria-label="Dashboard content">
            <Outlet />
          </main>

          {rightPanelOpen ? (
            <aside
              aria-label="Right utility panel"
              className="w-[360px] shrink-0 border-l border-white/10 bg-zinc-950 p-4"
            >
              <section className="rounded-md border border-white/10 bg-white/5 p-3">
                <h2 className="text-sm font-semibold text-white">Utility Panel</h2>
                <p className="mt-1 text-xs text-zinc-400">Batch 1 shell region reserved for dashboard utilities.</p>
              </section>
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  )
}
