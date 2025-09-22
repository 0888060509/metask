"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tag } from "@/lib/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";

export const tagColors: Tag['color'][] = [
    'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    'bg-pink-500/10 text-pink-700 dark:text-pink-400',
    'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
    'bg-orange-500/10 text-orange-700 dark:text-orange-400',
    'bg-teal-500/10 text-teal-700 dark:text-teal-400',
    'bg-gray-500/10 text-gray-700 dark:text-gray-400',
    'bg-lime-500/10 text-lime-700 dark:text-lime-400',
    'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400',
    'bg-red-500/10 text-red-700 dark:text-red-400',
    'bg-sky-500/10 text-sky-700 dark:text-sky-400',
    'bg-green-500/10 text-green-700 dark:text-green-400',
    'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
];

type ColorPickerProps = {
  selectedColor: Tag['color'];
  onColorChange: (color: Tag['color']) => void;
  className?: string;
};

export function ColorPicker({
  selectedColor,
  onColorChange,
  className,
}: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);
  const colorName = selectedColor.split(' ')[0].split('-')[1];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <div className="flex items-center gap-2">
            <div className={cn("w-4 h-4 rounded-full", colorName ? `bg-${colorName}-500` : 'bg-transparent')}></div>
            <span className="capitalize">{colorName}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-2">
        <div className="grid grid-cols-4 gap-2">
          {tagColors.map((color) => {
            const colorValue = color.split(' ')[0].split('-')[1];
            return (
              <Button
                key={color}
                variant="outline"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  color === selectedColor && "ring-2 ring-ring ring-offset-2"
                )}
                onClick={() => {
                  onColorChange(color);
                  setOpen(false);
                }}
              >
                <div className={cn("w-4 h-4 rounded-full", `bg-${colorValue}-500`)} />
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
