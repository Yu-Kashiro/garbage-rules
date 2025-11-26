"use client";

import { PREDEFINED_COLORS } from "@/lib/colors";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const selectedColor = PREDEFINED_COLORS.find((c) => c.value === value);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue>
            {selectedColor && (
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: selectedColor.value }}
                />
                <span>{selectedColor.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {PREDEFINED_COLORS.map((color) => (
            <SelectItem key={color.value} value={color.value}>
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.value }}
                />
                <span>{color.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
