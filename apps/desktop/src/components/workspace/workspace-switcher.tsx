import { useMemo, useState } from 'react'

import { useAppStore } from '@/stores/app-store'

type WorkspaceSwitcherProps = {
  collapsed: boolean
}

export function WorkspaceSwitcher({ collapsed }: WorkspaceSwitcherProps) {
  const [open, setOpen] = useState(false)
  const workspaces = useAppStore((state) => state.workspaces)
  const activeWorkspaceId = useAppStore((state) => state.activeWorkspaceId)
  const setActiveWorkspaceId = useAppStore((state) => state.setActiveWorkspaceId)

  const activeWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.id === activeWorkspaceId) ?? workspaces[0],
    [activeWorkspaceId, workspaces],
  )

  if (!activeWorkspace) {
    return null
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Workspace switcher"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2 py-2 text-left text-sm text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/10 text-xs font-semibold text-white">
          {activeWorkspace.initials}
        </span>
        {!collapsed ? (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-white">{activeWorkspace.name}</span>
              <span className="block truncate text-xs text-zinc-400">{activeWorkspace.role}</span>
            </span>
            <span aria-hidden className="text-xs text-zinc-400">
              ▾
            </span>
          </>
        ) : null}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute left-0 z-20 mt-2 w-64 rounded-md border border-white/10 bg-zinc-900 p-1 shadow-lg"
        >
          {workspaces.map((workspace) => (
            <button
              key={workspace.id}
              type="button"
              role="menuitem"
              onClick={() => {
                setActiveWorkspaceId(workspace.id)
                setOpen(false)
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-zinc-200 hover:bg-white/10"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-white/10 text-[10px] font-semibold">
                {workspace.initials}
              </span>
              <span className="min-w-0 flex-1 truncate">{workspace.name}</span>
              {workspace.id === activeWorkspaceId ? <span className="text-xs text-zinc-400">Active</span> : null}
            </button>
          ))}

          <div className="my-1 border-t border-white/10" />
          <button type="button" role="menuitem" className="w-full rounded-md px-2 py-2 text-left text-sm text-zinc-200 hover:bg-white/10">
            Manage workspace
          </button>
          <button type="button" role="menuitem" className="w-full rounded-md px-2 py-2 text-left text-sm text-zinc-200 hover:bg-white/10">
            Invite member
          </button>
          <button type="button" role="menuitem" className="w-full rounded-md px-2 py-2 text-left text-sm text-zinc-200 hover:bg-white/10">
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  )
}
