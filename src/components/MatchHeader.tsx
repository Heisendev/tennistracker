interface MatchHeaderProps {
  tournament: string;
  round: string;
  surface: string;
  date: string;
  duration: string;
}

const MatchHeader = ({ tournament, round, surface, date, duration }: MatchHeaderProps) => {
  return (
    <div
      className="text-center mb-8"
    >
      <div className="inline-flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Post-Match Stats
        </span>
      </div>
      <h1 className="text-4xl md:text-6xl font-display text-foreground mb-3">
        {tournament}
      </h1>
      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
        <span>{round}</span>
        <span className="w-1 h-1 rounded-full bg-muted-foreground" />
        <span className="capitalize">{surface}</span>
        <span className="w-1 h-1 rounded-full bg-muted-foreground" />
        <span>{date}</span>
        <span className="w-1 h-1 rounded-full bg-muted-foreground" />
        <span>{duration}</span>
      </div>
    </div>
  );
};

export default MatchHeader;