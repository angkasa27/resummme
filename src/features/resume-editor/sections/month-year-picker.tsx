"use client";

import { useMemo, useState } from "react";
import { addYears, format, getYear, setMonth, startOfMonth, startOfYear } from "date-fns";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  formatMonthYear,
  parseMonthYear,
} from "@/features/resume-editor/lib/month-year";
import { cn } from "@/lib/utils";

type MonthYearPickerProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  ariaInvalid?: boolean;
};

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function MonthYearPicker({
  id,
  value,
  onChange,
  placeholder = "Select month and year",
  disabled = false,
  ariaInvalid = false,
}: MonthYearPickerProps) {
  const selectedDate = useMemo(() => parseMonthYear(value), [value]);
  const [open, setOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState<Date>(
    selectedDate ?? startOfMonth(new Date())
  );
  const displayYearStart = startOfYear(displayMonth);

  function handleSelectMonth(monthIndex: number) {
    const nextDate = setMonth(displayYearStart, monthIndex);
    onChange(formatMonthYear(nextDate));
    setDisplayMonth(nextDate);
    setOpen(false);
  }

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen && selectedDate) {
          setDisplayMonth(selectedDate);
        }

        setOpen(nextOpen);
      }}
    >
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={ariaInvalid}
            className={cn(
              "h-9 w-full justify-between rounded-lg border-input px-3 font-normal",
              !value && "text-muted-foreground"
            )}
          />
        }
      >
        <span>{value || placeholder}</span>
        <CalendarIcon className="size-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[320px] gap-3">
        <PopoverHeader>
          <PopoverTitle>Month and year</PopoverTitle>
          <PopoverDescription>
            Pick the month that should be saved to this CV field.
          </PopoverDescription>
        </PopoverHeader>

        <div className="rounded-lg border bg-muted/20 p-2">
          <Calendar
            mode="single"
            month={displayMonth}
            selected={selectedDate}
            onMonthChange={(nextMonth) => setDisplayMonth(startOfMonth(nextMonth))}
            startMonth={new Date(1970, 0, 1)}
            endMonth={addYears(new Date(), 10)}
            captionLayout="dropdown"
            showOutsideDays={false}
            classNames={{
              month: "gap-2",
              table: "hidden",
              weekdays: "hidden",
              week: "hidden",
            }}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setDisplayMonth((currentMonth) => addYears(currentMonth, -1))}
            aria-label={`Show ${getYear(displayMonth) - 1}`}
          >
            <ChevronLeftIcon />
          </Button>
          <div className="text-sm font-medium">{getYear(displayMonth)}</div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setDisplayMonth((currentMonth) => addYears(currentMonth, 1))}
            aria-label={`Show ${getYear(displayMonth) + 1}`}
          >
            <ChevronRightIcon />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {monthLabels.map((monthLabel, monthIndex) => {
            const monthDate = setMonth(displayYearStart, monthIndex);
            const isSelected =
              selectedDate &&
              selectedDate.getFullYear() === monthDate.getFullYear() &&
              selectedDate.getMonth() === monthDate.getMonth();

            return (
              <Button
                key={monthLabel}
                type="button"
                variant={isSelected ? "default" : "outline"}
                className="justify-center"
                onClick={() => handleSelectMonth(monthIndex)}
              >
                {format(monthDate, "MMM")}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
