import React from 'react'
import ReactDOM from 'react-dom/client'

import { AppRouter } from '@/routes/app-router'
import '@/styles/index.css'
import { AppProviders } from './providers/app-providers'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </React.StrictMode>,
)