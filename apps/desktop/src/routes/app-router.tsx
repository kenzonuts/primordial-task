import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'

import { AppShellLayout } from '@/layouts/app-shell-layout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShellLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/foundation" replace />,
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