import { BarChart3, List, LogOut, PenSquare, Radio, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { LanguageSelector } from "@components/LanguageSelector";
import SectionCard from "@components/SectionCard";
import { useAuth } from "@providers/useAuth";

const Home = () => {
  const { t } = useTranslation();
  const { logout, user } = useAuth();

  const sections = [
    {
      title: t("home.matchStats"),
      description: t("home.matchStatsDesc"),
      icon: BarChart3,
      to: "/matches",
      ready: true,
    },
    {
      title: t("home.players"),
      description: t("home.playersDesc"),
      icon: Users,
      to: "/players",
      ready: true,
    },
    {
      title: t("home.createMatch"),
      description: t("home.createMatchDesc"),
      icon: PenSquare,
      to: "/newmatch",
      ready: true,
    },
    {
      title: t("home.liveTracker"),
      description: t("home.liveTrackerDesc"),
      icon: Radio,
      to: "/live",
      ready: false,
    },
    {
      title: t("home.matches"),
      description: t("home.matchesDesc"),
      icon: List,
      to: "/matches",
      ready: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background court-texture flex flex-col items-center justify-center px-4 py-16">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSelector />
        <button
          onClick={logout}
          title={t("auth.logout")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-white/20"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">{user?.username}</span>
        </button>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-display tracking-wider text-foreground flex glow-text">
          <img src="../../logo.png" alt="" className="inline-block md:mr-6 md:max-h-16 mr-4 max-h-11" />{t("home.title")}
        </h1>
        <p className="mt-3 text-muted-foreground text-sm md:text-base tracking-widest uppercase">
          Experimental Stats Viewer
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full">
        {sections.map((s) => (
          <div key={s.title}>
            {s.ready ? (
              <Link
                to={s.to}
                className="block group visited:text-gray-800 text-gray-800"
              >
                <SectionCard section={s} />
              </Link>
            ) : (
              <div className="opacity-60 cursor-not-allowed">
                <SectionCard section={s} />
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-16">
        Experimental Tennis Stats Viewer • Data for demonstration purposes
      </p>
    </div>
  );
};

export default Home;
