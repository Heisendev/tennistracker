import { Link } from "react-router";
import { BarChart3, Radio, PenSquare, Users, List } from "lucide-react";

import SectionCard from "@components/SectionCard";

const sections = [
  {
    title: "Match Stats",
    description: "Post-match head-to-head stat breakdowns with animated comparisons",
    icon: BarChart3,
    to: "/matches",
    ready: true,
  },
  {
    title: "Live Tracker",
    description: "Follow matches in real-time with point-by-point updates",
    icon: Radio,
    to: "/live",
    ready: false,
  },
  {
    title: "Create Match",
    description: "Log a new match with scores, stats, and player details",
    icon: PenSquare,
    to: "/newmatch",
    ready: true,
  },
  {
    title: "Players",
    description: "Browse and manage your roster of tracked players",
    icon: Users,
    to: "/players",
    ready: true,
  },
  {
    title: "Matches",
    description: "View the full archive of recorded matches",
    icon: List,
    to: "/matches",
    ready: false,
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background court-texture flex flex-col items-center justify-center px-4 py-16">
      <div
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-display tracking-wider text-foreground glow-text">
          Tennis Lab
        </h1>
        <p className="mt-3 text-muted-foreground text-sm md:text-base tracking-widest uppercase">
          Experimental Stats Viewer
        </p>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full"
      >
        {sections.map((s) => (
          <div key={s.title}>
            {s.ready ? (
              <Link to={s.to} className="block group visited:text-gray-800 text-gray-800">
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