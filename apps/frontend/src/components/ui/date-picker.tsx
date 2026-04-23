"use client";

import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = "Pick a date",
  error,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const selected = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;
  const validSelected = selected && isValid(selected) ? selected : undefined;

  const handleSelect = (day: Date | undefined) => {
    onChange(day ? format(day, "yyyy-MM-dd") : "");
    setOpen(false);
  };

  const inputId = label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={inputId}
            type="button"
            className={cn(
              "flex w-full items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm shadow-sm transition-colors text-left",
              "focus:outline-none focus:ring-1",
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500",
              open && !error && "border-blue-500 ring-1 ring-blue-500",
            )}
          >
            <CalendarIcon className="h-4 w-4 shrink-0 text-gray-400" />
            <span className={cn("flex-1", !validSelected && "text-gray-400")}>
              {validSelected ? format(validSelected, "MMM d, yyyy") : placeholder}
            </span>
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={validSelected}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
