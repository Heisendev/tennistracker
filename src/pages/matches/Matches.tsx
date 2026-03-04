import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { useGetMatches } from "@hooks/useMatches";
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

const Matches = () => {
  const { data: matches, isLoading } = useGetMatches();
  const { t } = useTranslation();

  return (
    <>
      <Header title={t("matches.title")}>
        <Link
          className="bg-(--bg-interactive-secondary) hover:bg-(--bg-interactive-secondary-hover) border border-(--bg-color-brand) text-(--bg-color-brand) px-4 py-2 text-sm rounded ml-auto"
          to="/newmatch"
        >
          {t("matches.createMatch")}
        </Link>
      </Header>
      <main className="md:m-8">
        <div className="max-w-3xl mx-auto px-0 py-0">
          <h2 className="mt-4 text-xl font-semibold">
            {t("matches.recentMatches")}
          </h2>
          {isLoading && <p>Loading...</p>}
          <motion.ul
            className="flex flex-col list-none pl-0"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {matches &&
              matches.length > 0 &&
              matches.map((match) => (
                <motion.li
                  animate="show"
                  key={match.id}
                  variants={item}
                  className="flex py-2"
                >
                  <Link
                    key={match.id}
                    to={`/matches/${match.id}`}
                    className="px-6 hover:bg-primary-dark transition-colors w-full text-(--color-text-static-primary)"
                  >
                    <div className="group relative bg-white border border-gray-400 p-4 md:p-5 hover:border-gray-600 transition-all duration-300 hover:glow-primary">
                      {match.playerA.firstname} {match.playerA.lastname} vs{" "}
                      {match.playerB.firstname} {match.playerB.lastname} -{" "}
                      {match.tournament} {match.round}{" "}
                    </div>
                  </Link>
                </motion.li>
              ))}
          </motion.ul>
        </div>
      </main>
    </>
  );
};

export default Matches;
