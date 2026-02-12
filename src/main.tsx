import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import Match from '@pages/Match.tsx'
import Home from '@pages/Home.tsx'
import MatchTracker from '@pages/MatchTracker.tsx'
import { AppProviders } from '@providers/AppProviders'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/newmatch" element={<MatchTracker />} />
      <Route path="/matches/:id" element={<Match />} />

    </Routes>
    </BrowserRouter>
    </AppProviders>
  </StrictMode>
)
