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
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  ariaInvalid?: boolean;
  minValueExclusive?: string;
};

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
              "h-9 w-full justify-between rounded-[10px] border-input px-3 font-normal",
              !value && "text-muted-foreground",
            )}
          />
        }
      >
        <span>{value || placeholder}</span>
        <CalendarIcon className="size-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[320px] gap-3 rounded-[12px]">
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
            size="icon"
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
            size="icon"
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
            const isSelected =
              selectedDate &&
              selectedDate.getFullYear() === monthDate.getFullYear() &&
              selectedDate.getMonth() === monthDate.getMonth();
            const isDisabled =
              minExclusiveDate &&
              monthDate.getTime() <= minExclusiveDate.getTime();

            return (
              <Button
                key={monthLabel}
                type="button"
                variant={isSelected ? "default" : "outline"}
                className="justify-center"
                disabled={Boolean(isDisabled)}
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
