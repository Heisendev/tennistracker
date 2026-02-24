import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, Routes } from "react-router";

import "./i18n";

import ProtectedRoute from "@components/ProtectedRoute";
import Home from "@pages/Home.tsx";
import Login from "@pages/Login.tsx";
import CreateMatch from "@pages/matches/CreateMatch";
import Match from "@pages/matches/Match";
import Matches from "@pages/matches/Matches";
import CreatePlayer from "@pages/players/CreatePlayer";
import Players from "@pages/players/Players";
import { AppProviders } from "@providers/AppProviders";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/newmatch" element={<CreateMatch />} />
          <Route path="/matches/" element={<Matches />} />
          <Route path="/matches/:id" element={<Match />} />
          <Route path="/players" element={<Players />} />
          <Route path="/players/new" element={<CreatePlayer />} />
        </Route>
      </Routes>
    </AppProviders>
  </StrictMode>,
);
