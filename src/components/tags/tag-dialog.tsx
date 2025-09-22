"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Tag } from "@/lib/types";
import { ColorPicker, tagColors } from "./color-picker";

type TagDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: Tag | null;
  onSave: (tagData: { name: string; color: Tag['color'] }) => void;
};

export function TagDialog({ open, onOpenChange, tag, onSave }: TagDialogProps) {
  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState<Tag['color']>(tagColors[0]);

  React.useEffect(() => {
    if (open) {
      setName(tag?.name || "");
      setColor(tag?.color || tagColors[0]);
    }
  }, [open, tag]);

  const handleSave = () => {
    if (!name) {
      alert("Tag name is required.");
      return;
    }
    onSave({ name, color });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">
            {tag ? "Edit Tag" : "Create Tag"}
          </DialogTitle>
          <DialogDescription>
            {tag ? "Update the details of your tag." : "Enter the details for your new tag."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">
              Color
            </Label>
            <ColorPicker
              selectedColor={color}
              onColorChange={setColor}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Tag</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
