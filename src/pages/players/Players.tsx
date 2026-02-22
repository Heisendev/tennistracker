import { useState } from "react";
import { usePlayers } from "../../hooks/usePlayers";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import Input from "@components/ui/Input";
import { useTranslation } from "react-i18next";

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
      <div className="backdrop-blur-sm sticky top-0 z-10 border-b border-gray-300 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-display tracking-wider text-foreground">
            {t("players.title")}
          </h1>
          <Link
            className="bg-(--bg-interactive-secondary) hover:bg-(--bg-interactive-secondary-hover) border border-(--bg-color-brand) text-(--bg-color-brand) px-4 py-2 text-sm rounded ml-auto"
            to="/players/new"
          >
            {t("players.createPlayer")}
          </Link>
        </div>
      </div>
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
                <div className="group relative bg-white border border-gray-400  rounded-lg p-4 md:p-5 hover:border-gray-600 transition-all duration-300 hover:glow-primary">
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
