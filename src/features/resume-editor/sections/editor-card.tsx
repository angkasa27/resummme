import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

type EditorCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  isActive: boolean;
  isDirty: boolean;
  onRequestOpen: () => void;
  footerActions: ReactNode;
  children: ReactNode;
};

export function EditorCard({
  icon,
  title,
  description,
  isActive,
  isDirty,
  onRequestOpen,
  footerActions,
  children,
}: EditorCardProps) {
  return (
    <Collapsible open={isActive}>
      <Card className={cn(isActive ? "ring-primary/25" : undefined)}>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-muted p-2 text-muted-foreground">{icon}</div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>{title}</CardTitle>
                {isDirty ? <Badge>Unsaved</Badge> : null}
              </div>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <CardAction>
            <CollapsibleTrigger
              className="inline-flex rounded-lg border border-input px-3 py-2 text-sm font-medium"
              onClick={onRequestOpen}
            >
              {isActive ? "Editing" : "Open"}
            </CollapsibleTrigger>
          </CardAction>
        </CardHeader>

        {isActive ? (
          <CollapsibleContent>
            <CardContent className="flex flex-col gap-5">{children}</CardContent>
            <div className="flex flex-wrap items-center justify-end gap-2 border-t bg-muted/30 px-4 py-3">
              {footerActions}
            </div>
          </CollapsibleContent>
        ) : null}
      </Card>
    </Collapsible>
  );
}
