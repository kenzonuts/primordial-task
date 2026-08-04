import type { PropsWithChildren } from 'react'

export function ThemeProvider({ children }: PropsWithChildren) {
  return <div className="dark min-h-screen bg-zinc-950 text-zinc-100">{children}</div>
}