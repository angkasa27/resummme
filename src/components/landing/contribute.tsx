import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RevealItem, RevealStagger } from "./reveal";

const GITHUB_URL = "https://github.com/angkasa27/resume-editor";

export function Contribute() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-32 md:py-40">
      <CtaBackdrop />

      <RevealStagger className="relative mx-auto max-w-3xl text-center">
        <RevealItem>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Start building your{" "}
            <span className="bg-linear-to-r from-violet-500 to-indigo-600 bg-clip-text text-transparent">
              resume
            </span>
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="mx-auto mt-5 max-w-xl text-balance text-muted-foreground">
            Open the editor and have a polished PDF ready in minutes. Resummme
            is open source, so if you build something useful or spot a bug, the
            repo is open to your pull requests.
          </p>
        </RevealItem>
        <RevealItem className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/editor"
            className={cn(
              buttonVariants({ variant: "ai", size: "lg" }),
              "px-5",
            )}
          >
            Open Editor
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "px-5",
            )}
          >
            <GithubMarkIcon className="size-4" />
            Star on GitHub
          </a>
        </RevealItem>
      </RevealStagger>
    </section>
  );
}

/** Faint masked grid + soft violet glow, echoing the hero backdrop. */
function CtaBackdrop() {
  const mask =
    "radial-gradient(ellipse 60% 65% at 50% 100%, black, transparent 78%)";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 60% at 50% 100%, rgba(139, 92, 246, 0.16), transparent 70%)",
        }}
      />
    </div>
  );
}

function GithubMarkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}
