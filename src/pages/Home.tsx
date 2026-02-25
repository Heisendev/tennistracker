import { motion } from "framer-motion";
import {
  BarChart3,
  Radio,
  Users,
  Target,
  TrendingUp,
  Activity,
  PieChart,
  ArrowRight,
  Star,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { Button } from "@components/ui/Button";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

/* ─── data ─── */
const features = [
  {
    icon: BarChart3,
    title: "Post-Match Analytics",
    desc: "Head-to-head stat breakdowns with animated comparisons across every category.",
  },
  {
    icon: Radio,
    title: "Live Point Tracking",
    desc: "Track matches point-by-point in real time. Aces, winners, errors — all logged instantly.",
  },
  {
    icon: Users,
    title: "Player Profiles",
    desc: "Build your roster. Track W-L records, win percentages, and career stats.",
  },
  {
    icon: Target,
    title: "Serve Analytics",
    desc: "First serve %, double faults, ace counts — drill into serve performance.",
  },
  {
    icon: TrendingUp,
    title: "Trend Lines",
    desc: "Spot patterns across matches. See how performance evolves over time.",
  },
  {
    icon: PieChart,
    title: "Shot Distribution",
    desc: "Visualize winner vs error ratios with real-time breakdowns per set.",
  },
];

const steps = [
  {
    num: "01",
    title: "Add Players",
    desc: "Register your roster with names, rankings, and play styles.",
  },
  {
    num: "02",
    title: "Track Live",
    desc: "Start a match and log every point with one-tap controls.",
  },
  {
    num: "03",
    title: "Analyze",
    desc: "Review animated stat comparisons and performance trends.",
  },
];

const testimonials = [
  {
    quote:
      "Finally a stats tool that actually feels like it was built for tennis. The live tracker is addictive.",
    name: "Alex R.",
    role: "Club Coach",
    stars: 5,
  },
  {
    quote:
      "I use it to review every match with my students. The animated breakdowns make it click instantly.",
    name: "Maria S.",
    role: "Private Coach",
    stars: 5,
  },
  {
    quote:
      "Clean, fast, no fluff. I can track a match and have the stats ready before I walk off court.",
    name: "James T.",
    role: "Competitive Player",
    stars: 5,
  },
];

const faqs = [
  {
    q: "Is Tennis Lab free to use?",
    a: "Yes — the core features including live tracking and stat breakdowns are completely free.",
  },
  {
    q: "Can I track doubles matches?",
    a: "Doubles support is on the roadmap. Currently the tracker is optimized for singles.",
  },
  {
    q: "Does it work offline?",
    a: "Not yet, but offline-first tracking with sync is planned for a future release.",
  },
  {
    q: "How accurate is the live tracking?",
    a: "It's as accurate as your input — every stat is logged by you, point by point, with no estimation.",
  },
];

/* ─── sections ─── */

const Hero = () => (
  <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
    {/* ambient glow */}
    <div className="absolute inset-0 court-texture" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-(--color-text-static-accent)/10 blur-[120px] pointer-events-none" />

    <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
      <motion.div
        className="inline-flex items-center gap-2 bg-(--color-text-static-accent)/10 border border-(--color-text-static-accent)/20 rounded-full px-4 py-1.5 mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Activity className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs tracking-widest uppercase text-primary font-medium">
          Experimental Stats Engine
        </span>
      </motion.div>

      <motion.h1
        className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display tracking-wider text-foreground leading-none m-0"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        Tennis Lab
      </motion.h1>

      <motion.p
        className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        Track every point. Analyze every pattern. A data-driven toolkit for
        players and coaches who want more from their match stats.
      </motion.p>

      <motion.div
        className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Link
          to="/dashboard"
          className="px-8 h-11 bg-(--color-text-static-accent) text-(--color-text-static-inverse) rounded-md hover:bg-(--color-text-static-accent)/70 transition-colors inline-flex items-center gap-2"
        >
          Open Dashboard <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/live"
          className="px-8 h-11 bg-(--color-text-static-inverse) text-(--color-text-static-primary) rounded-md hover:text-(--color-text-static-primary)/70 transition-colors inline-flex items-center gap-2 border border-(--color-text-static-tertiary)"
          aria-disabled
        >
          <Radio className="w-4 h-4" /> Try Live Tracker
        </Link>
      </motion.div>

      {/* mini stats ticker */}
      <motion.div
        className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        {[
          { label: "Stats Tracked", value: "24+" },
          { label: "Real-Time", value: "< 1s" },
          { label: "Set Support", value: "Bo3 / Fr2" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl md:text-3xl font-display text-primary m-0">
              {s.value}
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

const Features = () => (
  <section className="py-24 px-6">
    <div className="max-w-6xl mx-auto">
      <motion.div
        className="text-center mb-16"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
          Features
        </p>
        <h2 className="text-4xl md:text-5xl font-display text-foreground">
          Built for Precision
        </h2>
        <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
          Every tool designed around the data that actually matters on court.
        </p>
      </motion.div>

      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={fadeUp}
            className="group relative bg-card backdrop-blur-sm border border-(--color-border-accent)/60 rounded-lg p-6 hover:border-(--color-background-interactive-danger-default)/40 transition-colors duration-300"
          >
            <div className="p-2.5 rounded-md bg-(--color-text-static-accent)/10 text-(--color-text-static-accent) w-fit mb-4">
              <f.icon className="w-5 h-5" />
            </div>
            <h3 className="text-left font-display text-xl tracking-wide text-foreground">
              {f.title}
            </h3>
            <p className="text-left text-sm text-muted-foreground mt-2 mb-0 leading-relaxed">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section className="py-24 px-6 bg-card/40">
    <div className="max-w-4xl mx-auto">
      <motion.div
        className="text-center mb-16"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
          How It Works
        </p>
        <h2 className="text-4xl md:text-5xl font-display text-foreground">
          Three Steps. Full Insight.
        </h2>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 gap-8"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            variants={fadeUp}
            custom={i}
            className="text-center md:text-left"
          >
            <span className="text-5xl font-display text-(--color-text-static-accent)/50">
              {s.num}
            </span>
            <h3 className="text-2xl font-display text-foreground mt-2">
              {s.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {s.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

const Testimonials = () => (
  <section className="py-24 px-6">
    <div className="max-w-5xl mx-auto">
      <motion.div
        className="text-center mb-16"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
          Testimonials
        </p>
        <h2 className="text-4xl md:text-5xl font-display text-foreground">
          Trusted on Court
        </h2>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 gap-6"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {testimonials.map((t) => (
          <motion.div
            key={t.name}
            variants={fadeUp}
            className="bg-card backdrop-blur-sm border border-(--color-border-accent)/60 rounded-lg p-6"
          >
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: t.stars }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-foreground leading-relaxed italic">
              "{t.quote}"
            </p>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm font-medium text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-24 px-6 bg-card/40">
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
            FAQ
          </p>
          <h2 className="text-4xl md:text-5xl font-display text-foreground">
            Common Questions
          </h2>
        </motion.div>

        <motion.div
          className="space-y-3"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="border border-border rounded-lg overflow-hidden"
            >
              <Button
                variant="secondary"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left bg-card hover:bg-card transition-colors border-0!"
              >
                <span className="text-sm font-medium text-foreground">
                  {f.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </Button>
              <motion.div
                initial={false}
                animate={{
                  height: open === i ? "auto" : 0,
                  opacity: open === i ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-t border-(--color-border-accent)/20"
              >
                <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                  {f.a}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="border-t border-border py-12 px-6">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        <Activity className="w-5 h-5 text-primary" />
        <span className="font-display text-xl tracking-wider text-foreground">
          Tennis Lab
        </span>
      </div>
      <nav className="flex gap-6">
        {[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Match Stats", to: "/match-stats" },
          { label: "Players", to: "/players" },
          { label: "Live Tracker", to: "/live" },
        ].map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} Tennis Lab • Experimental
      </p>
    </div>
  </footer>
);

/* ─── page ─── */

const Home = () => (
  <div className="min-h-screen bg-background">
    <Hero />
    <Features />
    <HowItWorks />
    <Testimonials />
    <FAQ />
    <Footer />
  </div>
);

export default Home;
