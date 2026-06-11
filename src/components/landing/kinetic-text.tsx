import { cn } from "@/lib/utils";

/**
 * Per-letter kinetic heading: bold + indigo stroke by default, the hovered
 * letter (and its neighbours) thin out and shed the stroke. Pure CSS — no JS,
 * safe to render in a server component. Reused by the landing hero.
 */
export function KineticText({
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
          className="will-change-[font-weight,-webkit-text-stroke-width,padding] [-webkit-text-stroke-color:var(--color-indigo-600)]  [transition:font-weight_0.4s,-webkit-text-stroke-color_0.4s,-webkit-text-stroke-width_0.4s,padding_0.4s] hover:px-(--hover-padding) hover:font-thin hover:[-webkit-text-stroke-color:transparent] has-[+span+span:hover]:font-semibold has-[+span:hover]:px-(--hover-padding) has-[+span:hover]:font-normal [:hover+&]:px-(--hover-padding) [:hover+&]:font-normal [:hover+span+&]:font-semibold"
        >
          {letter === " " ? " " : letter}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </h1>
  );
}
