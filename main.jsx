import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App'
import { AdviceProvider } from './contexts/AdviceContext'

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <AdviceProvider>
      <App />
    </AdviceProvider>
  </React.StrictMode>
)
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App'
import { AdviceProvider } from './contexts/AdviceContext'

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <AdviceProvider>
      <App />
    </AdviceProvider>
  </React.StrictMode>
)
