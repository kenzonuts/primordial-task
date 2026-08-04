import type { PropsWithChildren } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@/shared/query/query-client'
import { ThemeProvider } from './theme-provider'
import { ToastProvider } from './toast-provider'
import { ModalProvider } from './modal-provider'
import { CommandPaletteProvider } from './command-palette-provider'
import { NotificationProvider } from './notification-provider'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ModalProvider>
            <CommandPaletteProvider>
              <NotificationProvider>{children}</NotificationProvider>
            </CommandPaletteProvider>
          </ModalProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}