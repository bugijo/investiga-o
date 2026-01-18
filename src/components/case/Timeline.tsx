interface TimelineEvent {
  date: string;
  time: string;
  description: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

const Timeline = ({ events }: TimelineProps) => {
  return (
    <section className="border border-muted/30 bg-card/30 p-4">
      <h3 className="text-xs text-muted-foreground tracking-[0.3em] mb-3 border-b border-muted/30 pb-2">
        CRONOLOGIA PRELIMINAR
      </h3>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={index} className="font-mono text-xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-muted-foreground">{event.date}</span>
              <span className="text-primary">— {event.time}</span>
            </div>
            <p className="text-foreground/80 pl-2 border-l border-muted/30">
              {'>'} {event.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Timeline;
