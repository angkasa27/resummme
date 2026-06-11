"use client";

import {
  useRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
} from "react";

import { FileCheckIcon } from "@/components/ui/file-check";
import { FingerprintIcon } from "@/components/ui/fingerprint";
import { GalleryThumbnailsIcon } from "@/components/ui/gallery-thumbnails";
import { MonitorCheckIcon } from "@/components/ui/monitor-check";
import { PenToolIcon } from "@/components/ui/pen-tool";
import { SparklesIcon } from "@/components/ui/sparkles";

import { Reveal, RevealItem, RevealStagger } from "./reveal";

type AnimatedIconHandle = { startAnimation: () => void; stopAnimation: () => void };
type AnimatedIcon = ForwardRefExoticComponent<
  HTMLAttributes<HTMLDivElement> & { size?: number } & RefAttributes<AnimatedIconHandle>
>;

type Feature = {
  Icon: AnimatedIcon;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    Icon: PenToolIcon,
    title: "Two ways to edit",
    description:
      "Drag and drop on the Canvas or fill in structured forms in the Classic editor. Same resume, your choice.",
  },
  {
    Icon: MonitorCheckIcon,
    title: "Instant live preview",
    description:
      "Every change renders immediately in a pixel-accurate preview, so what you see is exactly what you export.",
  },
  {
    Icon: GalleryThumbnailsIcon,
    title: "Multiple templates",
    description:
      "Switch between seven polished layouts like classic, sidebar, and timeline without retyping a thing.",
  },
  {
    Icon: FileCheckIcon,
    title: "Import and export PDF",
    description:
      "Bring in an existing resume to get started, then export a clean, print-ready PDF in one click.",
  },
  {
    Icon: SparklesIcon,
    title: "AI assistance",
    description:
      "Sharpen your wording and match job-description keywords with built-in AI insights and suggestions.",
  },
  {
    Icon: FingerprintIcon,
    title: "Private by default",
    description:
      "No account, no tracking, no paywall. Your data stays in your browser, and the whole project is on GitHub.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 sm:py-32 md:py-48">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need to <br />
          <span className="bg-linear-to-r from-violet-500 to-indigo-600 bg-clip-text text-transparent">
            craft your resume
          </span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          A focused, fast editor with the features that matter, and nothing that
          gets in your way.
        </p>
      </Reveal>

      <RevealStagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </RevealStagger>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const iconRef = useRef<AnimatedIconHandle>(null);
  const { Icon } = feature;

  return (
    <RevealItem
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
      className="group relative overflow-hidden rounded-2xl border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-lg hover:shadow-indigo-500/5"
    >
      {/* hover wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(120% 90% at 0% 0%, rgba(139, 92, 246, 0.07), transparent 55%)",
        }}
      />
      <span className="relative inline-flex size-10 items-center justify-center rounded-xl bg-linear-to-r from-violet-500 to-indigo-600 text-white shadow-sm ring-1 ring-violet-500/20 transition-transform duration-300 group-hover:scale-105">
        <Icon ref={iconRef} size={20} />
      </span>
      <h3 className="relative mt-4 font-semibold">{feature.title}</h3>
      <p className="relative mt-2 text-sm text-muted-foreground">
        {feature.description}
      </p>
    </RevealItem>
  );
}
