"use client"

import * as React from "react"
import * as icons from "lucide-react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// A list of curated icons from lucide-react
export const iconNames = [
  "FileText",
  "Package",
  "BarChart2",
  "Users",
  "Briefcase",
  "Book",
  "Building",
  "Code",
  "Feather",
  "Flag",
  "Folder",
  "Home",
  "Inbox",
  "Layers",
  "Lightbulb",
  "Rocket",
  "Server",
  "Settings",
  "ShoppingBag",
  "Star",
  "Target",
  "Terminal",
  "TrendingUp",
  "Zap",
] as const;

export type IconName = typeof iconNames[number];

export const iconMap = iconNames.reduce((acc, name) => {
  acc[name] = icons[name] as React.ComponentType<{ className?: string }>;
  return acc;
}, {} as Record<IconName, React.ComponentType<{ className?: string }>>);


type IconPickerProps = {
  selectedIcon: string
  onIconChange: (icon: IconName) => void
  className?: string
}

export function IconPicker({ selectedIcon, onIconChange, className }: IconPickerProps) {
  const [open, setOpen] = React.useState(false);
  const SelectedIconComponent = iconMap[selectedIcon as IconName];

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
            {SelectedIconComponent && <SelectedIconComponent className="h-4 w-4" />}
            {selectedIcon}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search icons..." />
          <CommandList>
            <CommandEmpty>No icons found.</CommandEmpty>
            <CommandGroup>
              {iconNames.map((name) => {
                const IconComponent = iconMap[name];
                return (
                  <CommandItem
                    key={name}
                    value={name}
                    onSelect={(currentValue) => {
                      onIconChange(currentValue as IconName);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedIcon === name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      {name}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
