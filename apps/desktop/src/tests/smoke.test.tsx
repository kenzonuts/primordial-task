import { render, screen } from '@testing-library/react'

import { AppRouter } from '@/routes/app-router'
import { AppProviders } from '@/providers/app-providers'

describe('app foundation', () => {
  it('renders foundation route landmark', async () => {
    window.history.pushState({}, '', '/foundation')

    render(
      <AppProviders>
        <AppRouter />
      </AppProviders>,
    )

    expect(await screen.findByLabelText('foundation-ready')).toBeInTheDocument()
  })
})