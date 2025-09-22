"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "./badge";

type MultiSelectComboboxProps = {
  options: { value: string; label: string }[];
  selected: string[];
  onSelectedChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyResult?: string;
  className?: string;
};

export function MultiSelectCombobox({
  options,
  selected,
  onSelectedChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search...",
  emptyResult = "Nothing found.",
  className,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    onSelectedChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value]
    );
  };
  
  const handleRemove = (value: string) => {
    onSelectedChange(selected.filter((item) => item !== value));
  }

  const selectedOptions = selected.map(value => options.find(option => option.value === value)).filter(Boolean);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn("relative w-full", className)}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between h-auto min-h-10",
              selected.length === 0 && "text-muted-foreground"
            )}
            onClick={() => setOpen(!open)}
          >
            <div className="flex gap-1 flex-wrap">
              {selectedOptions.length > 0 ? (
                selectedOptions.map(option => option && (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="rounded-sm"
                  >
                    {option.label}
                    <button
                      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent popover from opening/closing
                        handleRemove(option.value);
                      }}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))
              ) : (
                placeholder
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyResult}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    handleSelect(option.value);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
