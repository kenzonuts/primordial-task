import { render, screen } from '@testing-library/react'

import { AppRouter } from '@/routes/app-router'
import { AppProviders } from '@/providers/app-providers'

describe('app shell', () => {
  it('renders dashboard shell with navigation landmarks', async () => {
    window.history.pushState({}, '', '/dashboard')

    render(
      <AppProviders>
        <AppRouter />
      </AppProviders>,
    )

    expect(await screen.findByLabelText('Primary navigation')).toBeInTheDocument()
    expect(await screen.findByLabelText('Top navigation')).toBeInTheDocument()
    expect(await screen.findByLabelText('Dashboard content')).toBeInTheDocument()
  })

  it('still renders foundation route landmark', async () => {
    window.history.pushState({}, '', '/foundation')

    render(
      <AppProviders>
        <AppRouter />
      </AppProviders>,
    )

    expect(await screen.findByLabelText('foundation-ready')).toBeInTheDocument()
  })
})