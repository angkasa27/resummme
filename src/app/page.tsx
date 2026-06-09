import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 p-8 text-center">
      <KineticText
        text="Resummme"
        className="text-4xl md:text-6xl tracking-tight px-4"
      />
      <p className="max-w-md text-muted-foreground">
        A free, open-source resume editor. Write once, preview instantly, export
        to PDF — no account required.
      </p>
      <div className="flex gap-3">
        <Link
          href="/editor/canvas"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-foreground px-4 text-sm font-medium text-background hover:bg-foreground/90"
        >
          Open Editor
        </Link>
        <Link
          href="/editor/classic"
          className="inline-flex h-9 items-center justify-center rounded-lg border px-4 text-sm font-medium hover:bg-accent"
        >
          Classic Editor
        </Link>
      </div>
    </main>
  );
}

function KineticText({
  text,
  className,
  style,
  ...rest
}: React.HTMLAttributes<HTMLElement> & {
  text: string;
}) {
  const mergedStyle = {
    "--hover-padding": "calc(1em / 12)",
    ...(style as React.CSSProperties | undefined),
  } as React.CSSProperties;
  return (
    <h1
      {...rest}
      className={cn(
        "flex flex-wrap font-bold italic bg-linear-to-r from-violet-500 to-indigo-600 bg-clip-text text-transparent",
        className,
      )}
      style={mergedStyle}
    >
      {text.split("").map((letter, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="will-change-[font-weight,-webkit-text-stroke-width,padding] [-webkit-text-stroke-color:var(--color-indigo-600)] [-webkit-text-stroke-width:calc(var(--text-stroke-width)*2)] [transition:font-weight_0.4s,-webkit-text-stroke-color_0.4s,-webkit-text-stroke-width_0.4s,padding_0.4s] hover:px-(--hover-padding) hover:font-thin hover:[-webkit-text-stroke-color:transparent] hover:[-webkit-text-stroke-width:var(--text-stroke-width)] has-[+span+span:hover]:font-semibold has-[+span:hover]:px-(--hover-padding) has-[+span:hover]:font-normal [:hover+&]:px-(--hover-padding) [:hover+&]:font-normal [:hover+span+&]:font-semibold"
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </h1>
  );
}
