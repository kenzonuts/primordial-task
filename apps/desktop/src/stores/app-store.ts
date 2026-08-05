import { create } from 'zustand'

type Workspace = {
  id: string
  name: string
  initials: string
  role: string
}

type AppState = {
  initialized: boolean
  sidebarCollapsed: boolean
  rightPanelOpen: boolean
  workspaces: Workspace[]
  activeWorkspaceId: string
  setInitialized: (initialized: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebarCollapsed: () => void
  setRightPanelOpen: (open: boolean) => void
  toggleRightPanelOpen: () => void
  setActiveWorkspaceId: (workspaceId: string) => void
}

const defaultWorkspaces: Workspace[] = [
  {
    id: 'primordial-main',
    name: 'Primordial Workspace',
    initials: 'PW',
    role: 'Owner',
  },
]

export const useAppStore = create<AppState>((set) => ({
  initialized: false,
  sidebarCollapsed: false,
  rightPanelOpen: true,
  workspaces: defaultWorkspaces,
  activeWorkspaceId: defaultWorkspaces[0].id,
  setInitialized: (initialized) => set({ initialized }),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setRightPanelOpen: (rightPanelOpen) => set({ rightPanelOpen }),
  toggleRightPanelOpen: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
  setActiveWorkspaceId: (activeWorkspaceId) =>
    set((state) =>
      state.workspaces.some((workspace) => workspace.id === activeWorkspaceId)
        ? { activeWorkspaceId }
        : state,
    ),
}))
