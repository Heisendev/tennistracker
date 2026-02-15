import { useState } from "react";
import { usePlayers } from "../hooks/usePlayers";
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router";
import Input from "@components/ui/Input";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

const Players = () => {
    const {data: players, isLoading} = usePlayers()

    const [search, setSearch] = useState("");

    const filtered = (players || []).filter((p) =>
        p.lastname.toLowerCase().includes(search.toLowerCase())
    );

    if(isLoading) return <div>Loading</div>
    
    return (
        <div>
            <div className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl font-display tracking-wider text-foreground">Players</h1>
                    <span className="text-xs text-muted-foreground font-mono ml-auto">{filtered.length} players</span>
                </div>
                <div className="max-w-5xl mx-auto px-4 py-8">
                    {/* Search */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-8"
                    >
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="search"
                                label="Search player"
                                placeholder="Search players..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-card/60 border-border font-sans"
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
                        <div className="group relative bg-card/60 backdrop-blur-sm border border-border rounded-lg p-4 md:p-5 hover:border-primary/40 transition-all duration-300 hover:glow-primary">
                            <div className="flex items-center gap-4 md:gap-6">
                                {/* Rank */}
                                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                                    <span className="font-display text-lg text-primary">{player.rank}</span>
                                </div>

                                {/* Flag + Name */}
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <img
                                        alt={player.country}
                                        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${player.country}.svg`}
                                        className={"inline h-4"}
                                    />
                                    <div className="min-w-0">
                                        <h2 className="font-display text-xl md:text-2xl tracking-wide text-foreground truncate">
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