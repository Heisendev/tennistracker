import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { AppProviders } from "@providers/AppProviders";
import "./i18n";

import Home from "@pages/Home.tsx";
import CreateMatch from "@pages/matches/CreateMatch";
import Matches from "@pages/matches/Matches";
import Match from "@pages/matches/Match";
import CreatePlayer from "@pages/players/CreatePlayer";
import Players from "@pages/players/Players";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/newmatch" element={<CreateMatch />} />
          <Route path="/matches/" element={<Matches />} />
          <Route path="/matches/:id" element={<Match />} />
          <Route path="/players" element={<Players />} />
          <Route path="/players/new" element={<CreatePlayer />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  </StrictMode>,
);
