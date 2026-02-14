import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { AppProviders } from '@providers/AppProviders'

import Match from '@pages/Match.tsx'
import Home from '@pages/Home.tsx'
import MatchTracker from '@pages/MatchTracker.tsx'
import Matches from '@pages/Matches'

import './index.css'
import Players from '@pages/Players'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/newmatch" element={<MatchTracker />} />
      <Route path="/matches/" element={<Matches />} />
      <Route path="/matches/:id" element={<Match />} />
      <Route path="/players" element={<Players />} />

    </Routes>
    </BrowserRouter>
    </AppProviders>
  </StrictMode>
)
