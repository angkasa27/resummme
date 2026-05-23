import {
  BotMessageSquareIcon,
  FileSearchIcon,
  GaugeIcon,
  LucideIcon,
  SparklesIcon,
} from "lucide-react";

type UpcomingFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const UPCOMING: ReadonlyArray<UpcomingFeature> = [
  {
    icon: GaugeIcon,
    title: "ATS score",
    description: "Estimate how well your resume scans through tracking systems.",
  },
  {
    icon: FileSearchIcon,
    title: "Examine PDF",
    description: "Inspect the parsed structure of any uploaded PDF.",
  },
  {
    icon: BotMessageSquareIcon,
    title: "AI assist",
    description: "Rewrite bullets, sharpen impact, and tighten language.",
  },
];

export function InsightsTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        <SparklesIcon className="size-3.5 text-primary" />
        Coming soon
      </div>
      <ul className="flex flex-col gap-2">
        {UPCOMING.map((feature) => (
          <li
            key={feature.title}
            className="flex items-start gap-3 rounded-md border border-dashed bg-background px-3 py-2.5"
          >
            <feature.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{feature.title}</span>
              <span className="text-xs text-muted-foreground">
                {feature.description}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
