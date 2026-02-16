type Section = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  ready: boolean;
};

export interface SectionCardProps {
  section: Section;
}

const SectionCard = ({ section }: SectionCardProps) => {
  const Icon = section.icon;
  return (
    <div className="relative bg-card/60 border border-gray-400 bg-white rounded-lg p-6 h-full group-hover:border-primary/50 group-hover:glow-primary">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-md bg-(--bg-background-alert-danger)/10 text-primary shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-left">
          <h2 className="font-display text-xl tracking-wide m-0 text-foreground">
            {section.title}
          </h2>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {section.description}
          </p>
        </div>
      </div>
      {!section.ready && (
        <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest text-muted-foreground bg-muted/20 px-2 py-0.5 rounded">
          Soon
        </span>
      )}
    </div>
  );
};

export default SectionCard;
