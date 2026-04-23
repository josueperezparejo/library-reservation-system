"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium text-gray-900",
        nav: "flex items-center justify-between w-full absolute inset-x-0 top-1 px-2 z-30",
        button_previous:
          "inline-flex size-7 items-center justify-center rounded-md border border-gray-200 bg-transparent p-0 mt-2 text-gray-600 opacity-70 hover:opacity-100 hover:bg-gray-50 transition-all",
        button_next:
          "inline-flex size-7 items-center justify-center rounded-md border border-gray-200 bg-transparent p-0 mt-2 text-gray-600 opacity-70 hover:opacity-100 hover:bg-gray-50 transition-all",
        table: "w-full border-collapse",
        head_row: "grid grid-cols-7",
        weekday:
          "text-gray-400 rounded-md w-8 font-normal text-[0.8rem] text-center",
        row: "grid grid-cols-7 mt-2",
        day: cn(
          "w-8 h-8 text-center text-sm p-0 relative",
          "[&:has([aria-selected])]:bg-blue-50 [&:has([aria-selected])]:rounded-md",
        ),
        day_button:
          "inline-flex w-8 h-8 items-center justify-center rounded-md p-0 font-normal text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 aria-selected:opacity-100",
        selected:
          "[&>button]:bg-blue-600 [&>button]:text-white [&>button]:hover:bg-blue-600 [&>button]:hover:text-white",
        today:
          "[&>button]:bg-gray-100 [&>button]:text-gray-900 [&>button]:font-semibold",
        outside:
          "text-gray-300 aria-selected:bg-blue-50/50 aria-selected:text-gray-400",
        disabled: "text-gray-300 opacity-50",
        hidden: "invisible",

        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          ),
      }}
      {...props}
    />
  );
}
