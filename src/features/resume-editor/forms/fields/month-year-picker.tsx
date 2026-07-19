"use client";

import { useMemo, useState } from "react";
import {
  addYears,
  format,
  getYear,
  setMonth,
  startOfMonth,
  startOfYear,
} from "date-fns";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  formatMonthYear,
  parseMonthYear,
} from "@/features/resume-editor/domain/month-year";
import { FIELD_CONTROL_CLASS } from "@/features/resume-editor/forms/fields/field-control";
import { cn } from "@/lib/utils";

type MonthYearPickerProps = {
  id: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  ariaInvalid?: boolean;
  minValueExclusive?: string;
};

function isMonthSelected(monthDate: Date, selectedDate: Date | undefined) {
  return (
    !!selectedDate &&
    selectedDate.getFullYear() === monthDate.getFullYear() &&
    selectedDate.getMonth() === monthDate.getMonth()
  );
}

function isMonthDisabled(monthDate: Date, minExclusiveDate: Date | undefined) {
  return (
    !!minExclusiveDate && monthDate.getTime() <= minExclusiveDate.getTime()
  );
}

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function MonthYearPicker({
  id,
  value,
  onChange,
  placeholder = "Select month and year",
  disabled = false,
  ariaInvalid = false,
  minValueExclusive,
}: MonthYearPickerProps) {
  const selectedDate = useMemo(() => parseMonthYear(value), [value]);
  const minExclusiveDate = useMemo(
    () => parseMonthYear(minValueExclusive),
    [minValueExclusive],
  );
  const [open, setOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState<Date>(
    selectedDate ?? startOfMonth(new Date()),
  );
  const displayYearStart = startOfYear(displayMonth);
  const previousYear = getYear(displayMonth) - 1;
  const isPreviousYearDisabled =
    !!minExclusiveDate && previousYear < getYear(minExclusiveDate);

  function handleSelectMonth(monthIndex: number) {
    const nextDate = setMonth(displayYearStart, monthIndex);

    if (minExclusiveDate && nextDate.getTime() <= minExclusiveDate.getTime()) {
      return;
    }

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
              FIELD_CONTROL_CLASS,
              "justify-start font-normal",
              !value && "text-muted-foreground",
            )}
          />
        }
      >
        <CalendarIcon className="size-4 text-muted-foreground" />
        <span>{value || placeholder}</span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[320px] gap-4 rounded-md">
        {/* <PopoverHeader>
          <PopoverTitle>Month and year</PopoverTitle>
          <PopoverDescription>
            Pick the month that should be saved to this CV field.
          </PopoverDescription>
        </PopoverHeader> */}

        <div className="flex items-center justify-between rounded-[10px] border bg-background px-3 py-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={isPreviousYearDisabled}
            onClick={() =>
              setDisplayMonth((currentMonth) => addYears(currentMonth, -1))
            }
            aria-label={`Show ${getYear(displayMonth) - 1}`}
          >
            <ChevronLeftIcon />
          </Button>
          <div className="text-sm font-medium">{getYear(displayMonth)}</div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() =>
              setDisplayMonth((currentMonth) => addYears(currentMonth, 1))
            }
            aria-label={`Show ${getYear(displayMonth) + 1}`}
          >
            <ChevronRightIcon />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {monthLabels.map((monthLabel, monthIndex) => {
            const monthDate = setMonth(displayYearStart, monthIndex);

            return (
              <Button
                key={monthLabel}
                type="button"
                aria-pressed={isMonthSelected(monthDate, selectedDate)}
                variant={
                  isMonthSelected(monthDate, selectedDate)
                    ? "default"
                    : "outline"
                }
                className="justify-center"
                disabled={isMonthDisabled(monthDate, minExclusiveDate)}
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
