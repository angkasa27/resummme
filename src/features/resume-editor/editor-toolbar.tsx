import { DownloadIcon, PrinterIcon, UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EditorToolbarProps = {
  onOpenImportPicker: () => void;
  onExport: () => void;
  onPrint: () => void;
};

export function EditorToolbar({
  onOpenImportPicker,
  onExport,
  onPrint,
}: EditorToolbarProps) {
  return (
    <Card className="border-none bg-transparent py-0 shadow-none ring-0">
      <CardHeader className="rounded-3xl border bg-background px-5 py-5 shadow-sm">
        <div className="space-y-1">
          <CardTitle className="text-2xl">CV Editor</CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-6">
            Reorder and hide sections from the navigator. Edit one section at a time,
            then save that section to update the preview.
          </CardDescription>
        </div>
        <CardAction className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onOpenImportPicker}>
            <UploadIcon data-icon="inline-start" />
            Import JSON
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onExport}>
            <DownloadIcon data-icon="inline-start" />
            Export JSON
          </Button>
          <Button type="button" size="sm" onClick={onPrint}>
            <PrinterIcon data-icon="inline-start" />
            Print / Save PDF
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
