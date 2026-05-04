"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const TooltipContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function Tooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <span className="relative inline-flex">{children}</span>
    </TooltipContext.Provider>
  );
}

function TooltipTrigger({
  children,
  render,
}: {
  children?: React.ReactNode;
  render?: React.ReactElement<any>;
}) {
  const context = React.useContext(TooltipContext);

  if (!context) {
    throw new Error("TooltipTrigger must be used within Tooltip");
  }

  const child = (render ?? children) as React.ReactElement<any>;

  return React.cloneElement(child, {
    onMouseEnter: (event: React.MouseEvent) => {
      context.setOpen(true);
      child.props.onMouseEnter?.(event);
    },
    onMouseLeave: (event: React.MouseEvent) => {
      context.setOpen(false);
      child.props.onMouseLeave?.(event);
    },
    onFocus: (event: React.FocusEvent) => {
      context.setOpen(true);
      child.props.onFocus?.(event);
    },
    onBlur: (event: React.FocusEvent) => {
      context.setOpen(false);
      child.props.onBlur?.(event);
    },
  });
}

function TooltipContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(TooltipContext);

  if (!context?.open) {
    return null;
  }

  return (
    <span
      role="tooltip"
      className={cn(
        "pointer-events-none absolute inset-x-1/2 bottom-full z-50 mb-2 w-max max-w-48 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md",
        className
      )}
    >
      {children}
    </span>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
