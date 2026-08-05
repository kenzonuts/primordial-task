import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { AppShellLayout } from '@/layouts/app-shell-layout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShellLayout />,
    children: [
      {
        index: true,
        element: <section aria-label="dashboard-home" />,
      },
      {
        path: 'dashboard',
        element: <section aria-label="dashboard-home" />,
      },
      {
        path: 'projects',
        element: <section aria-label="projects-home" />,
      },
      {
        path: 'tasks',
        element: <section aria-label="tasks-home" />,
      },
      {
        path: 'kanban',
        element: <section aria-label="kanban-home" />,
      },
      {
        path: 'calendar',
        element: <section aria-label="calendar-home" />,
      },
      {
        path: 'analytics',
        element: <section aria-label="analytics-home" />,
      },
      {
        path: 'ai-workspace',
        element: <section aria-label="ai-workspace-home" />,
      },
      {
        path: 'developer-tools',
        element: <section aria-label="developer-tools-home" />,
      },
      {
        path: 'settings',
        element: <section aria-label="settings-home" />,
      },
      {
        path: 'foundation',
        element: <section aria-label="foundation-ready" />,
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
