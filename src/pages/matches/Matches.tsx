import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useGetMatches } from "../../hooks/useMatchs";

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

  console.log(matches);
  return (
    <>
      <header className="backdrop-blur-sm sticky top-0 z-10 border-b border-gray-300 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-display tracking-wider text-foreground">
            {t("home.matches")}
          </h1>
          <Link
            className="bg-(--bg-interactive-secondary) hover:bg-(--bg-interactive-secondary-hover) border border-(--bg-color-brand) text-(--bg-color-brand) px-4 py-2 text-sm rounded ml-auto"
            to="/newmatch"
          >
            {t("matches.createMatch")}
          </Link>
        </div>
      </header>
      <main className="m-8">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h2 className="mt-4 text-xl font-semibold">Recent Matches</h2>
          {isLoading && <p>Loading...</p>}
          <motion.ul
            className="grid gap-3 list-none pl-0"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {matches &&
              matches.length > 0 &&
              matches.map((match) => (
                <motion.li animate="show" key={match.id} variants={item}>
                    <Link
                      key={match.id}
                      to={`/matches/${match.id}`}
                      className="mt-4 px-6 py-3 hover:bg-primary-dark transition-colors"
                    >
                    <div className="group relative bg-white border border-gray-400  rounded-lg p-4 md:p-5 hover:border-gray-600 transition-all duration-300 hover:glow-primary">
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
