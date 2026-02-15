import { useState } from "react";
import { usePlayers } from "../hooks/usePlayers";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import Input from "@components/ui/Input";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

const Players = () => {
  const { data: players, isLoading } = usePlayers();

  const [search, setSearch] = useState("");

  const filtered = (players || []).filter((p) =>
    p.lastname.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-display tracking-wider text-foreground">
            Players
          </h1>
          <Link
            className="text-s bg-white border border-gray-300 p-2 visited:text-gray-900 rounded-l ml-auto"
            to="/players/new"
          >
            Add a player
          </Link>
          <span className="text-s text-muted-foreground font-display">
            {filtered.length} players
          </span>
        </div>
      </div>
      <div className="m-8">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="flex gap-4">
              <Input
                id="search"
                label="Search player"
                placeholder="Rafael Nadal"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </motion.div>
          {/* Player list */}
          <motion.div
            className="grid gap-3"
            variants={container}
            initial="hidden"
            animate="show"
            key={search}
          >
            {filtered.map((player) => (
              <motion.div key={player.id} variants={item}>
                <div className="group relative bg-white border border-gray-400  rounded-lg p-4 md:p-5 hover:border-primary/40 transition-all duration-300 hover:glow-primary">
                  <div className="flex items-center gap-4 md:gap-6">
                    {/* Rank */}
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                      <img
                        alt={player.country}
                        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${player.country}.svg`}
                        className={"inline h-4"}
                      />
                    </div>

                    {/* Flag + Name */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="min-w-0">
                        <h2 className="flex font-display text-xl md:text-2xl  gap-4 tracking-wide text-foreground truncate">
                          <span className="font-display text-primary">
                            {player.rank}
                          </span>
                          {player.firstname} {player.lastname}
                        </h2>
                        <p className="text-xs text-muted-foreground font-mono">
                          {player.hand} • {player.backhand} BH
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Players;
