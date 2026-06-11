"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  motion,
  MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BuilderFrame } from "./builder-showcase";
import { KineticText } from "./kinetic-text";

const GITHUB_URL = "https://github.com/angkasa27/resume-editor";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Previous showcase values — frame tilts back + scales down, flattening in.
  const rotateX = useTransform(scrollYProgress, [0, 0.65], [12, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.65], [0.8, 1]);
  // New for the merge: the frame rises up (faster than scroll) over the copy.
  const frameY = useTransform(scrollYProgress, [0, 1], ["20%", "-30%"]);

  const animated = !reduce;

  const contentFrameY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative">
      {/* Copy — previous hero padding, no scroll fade */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 pt-24 text-center sm:pt-32 md:pt-48">
        <HeroBackdrop scrollYProgress={scrollYProgress} animated={animated} />

        <motion.div
          className="flex flex-col items-center gap-6"
          variants={animated ? container : undefined}
          initial={animated ? "hidden" : false}
          animate={animated ? "show" : undefined}
          style={animated ? { y: contentFrameY } : undefined}
        >
          <motion.a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            variants={animated ? item : undefined}
            className="group inline-flex items-center gap-2 rounded-full border bg-background/70 py-1 pr-2 pl-3 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-foreground"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-violet-500 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-violet-500" />
            </span>
            Free &amp; open source
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </motion.a>

          <motion.div variants={animated ? item : undefined}>
            <KineticText
              text="Resummme"
              className="px-4 text-5xl tracking-tight md:text-7xl"
            />
          </motion.div>

          <motion.p
            variants={animated ? item : undefined}
            className="max-w-md text-balance text-muted-foreground"
          >
            Build a recruiter-ready resume in minutes. Write once, preview as
            you type, and export a clean PDF.
          </motion.p>

          <motion.div
            variants={animated ? item : undefined}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/editor/classic"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "px-5",
              )}
            >
              Classic Editor
            </Link>
            <Link
              href="/editor/canvas"
              className={cn(
                buttonVariants({ variant: "ai", size: "lg" }),
                "px-5",
              )}
            >
              Open Editor
            </Link>
          </motion.div>

          <motion.p
            variants={animated ? item : undefined}
            className="text-xs text-muted-foreground"
          >
            No sign-up. No paywall. Your data never leaves your browser.
          </motion.p>
        </motion.div>
      </div>

      {/* Builder frame — previous showcase layout, rises up to cover the copy */}
      <motion.div
        style={animated ? { y: frameY } : undefined}
        className="relative z-20 px-6"
      >
        <motion.div
          initial={
            animated ? { opacity: 0, y: 48, filter: "blur(16px)" } : false
          }
          animate={
            animated ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined
          }
          transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-6xl perspective-distant"
        >
          {/* ambient glow behind the frame */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-12 bottom-0 -z-10 blur-3xl"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 40%, rgba(139, 92, 246, 0.32), transparent 70%)",
            }}
          />
          <motion.div
            style={
              animated
                ? { rotateX, scale, transformOrigin: "center top" }
                : undefined
            }
          >
            <BuilderFrame />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/** Decorative grid + radial glow that fades out toward the bottom of the hero. */
function HeroBackdrop({
  scrollYProgress,
  animated = true,
}: {
  scrollYProgress: MotionValue<number>;
  animated?: boolean;
}) {
  const yPosition = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={animated ? { y: yPosition } : undefined}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 65% 55% at 50% 0%, black, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 55% at 50% 0%, black, transparent 75%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 0%, rgba(139, 92, 246, 0.16), transparent 70%)",
        }}
      />
    </motion.div>
  );
}
