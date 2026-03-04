import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import Input from "@components/ui/Input";
import { usePlayers } from "@hooks/usePlayers";
import Header from "@components/Header";

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
  const { t } = useTranslation();
  const { data: players, isLoading } = usePlayers();

  const [search, setSearch] = useState("");

  const filtered = (players || []).filter((p) =>
    p.lastname.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Header title={t("players.title")}>
        <Link
          className="bg-(--bg-interactive-secondary) hover:bg-(--bg-interactive-secondary-hover) border border-(--bg-color-brand) text-(--bg-color-brand) px-4 py-2 text-sm rounded ml-auto"
          to="/players/new"
        >
          {t("players.createPlayer")}
        </Link>
      </Header>
      <div className="md:m-8">
        <div className="max-w-3xl mx-auto px-4 py-8">
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
                label={t("players.searchPlayer")}
                placeholder="Rafael Nadal"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="text-s text-muted-foreground font-display ml-auto flex items-center">
                {filtered.length} {t("players.title").toLowerCase()}
              </span>
            </div>
          </motion.div>
          {/* Player list */}
          <motion.ul
            className="grid gap-3 list-none pl-0"
            variants={container}
            initial="hidden"
            animate="show"
            key={search}
          >
            {filtered.map((player) => (
              <motion.li key={player.id} variants={item}>
                <div className="group relative backdrop-blur-sm bg-white border border-gray-400 p-2 md:p-5 hover:border-(--color-background-accent-secondary) transition-all duration-300 hover:glow-color-background-accent-secondary">
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
                          {t(`players.${player.hand?.toLowerCase()}`)} • {t(`players.${player.backhand?.toLowerCase()}`)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </div>
  );
};

export default Players;
