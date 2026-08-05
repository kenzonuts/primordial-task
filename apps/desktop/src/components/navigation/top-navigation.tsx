import { useMemo } from 'react'

import { useAppStore } from '@/stores/app-store'

type TopNavigationProps = {
  onToggleRightPanel: () => void
}

export function TopNavigation({ onToggleRightPanel }: TopNavigationProps) {
  const workspaces = useAppStore((state) => state.workspaces)
  const activeWorkspaceId = useAppStore((state) => state.activeWorkspaceId)

  const activeWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.id === activeWorkspaceId) ?? workspaces[0],
    [activeWorkspaceId, workspaces],
  )

  return (
    <header className="flex h-12 items-center gap-3 border-b border-white/10 bg-zinc-950 px-4" aria-label="Top navigation">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{activeWorkspace?.name ?? 'Workspace'}</p>
      </div>

      <button type="button" className="rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-200 hover:bg-white/10">
        Search
      </button>
      <button type="button" className="rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-200 hover:bg-white/10">
        Quick Create
      </button>
      <button type="button" className="rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-200 hover:bg-white/10">
        Notifications
      </button>
      <button type="button" onClick={onToggleRightPanel} className="rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-200 hover:bg-white/10">
        Utility Panel
      </button>
      <button type="button" className="rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-200 hover:bg-white/10">
        Theme
      </button>
      <button type="button" className="rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-200 hover:bg-white/10">
        Profile
      </button>
    </header>
  )
}
