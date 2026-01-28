"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Check, AlertCircle, Sparkles, Hash } from "lucide-react";

interface ComputerNumberInputProps {
  value: number;
  onChange: (value: number) => void;
  existingNumbers: number[];
  currentEditingNumber?: number; // If editing, this is the original number
  label?: string;
  className?: string;
}

export function ComputerNumberInput({
  value,
  onChange,
  existingNumbers,
  currentEditingNumber,
  label = "Número",
  className = "",
}: ComputerNumberInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Numbers already in use (excluding current if editing)
  const usedNumbers = useMemo(() => {
    return new Set(
      existingNumbers.filter((n) => n !== currentEditingNumber)
    );
  }, [existingNumbers, currentEditingNumber]);

  // Check if current value is available
  const isCurrentValueAvailable = !usedNumbers.has(value);

  // Get suggested numbers
  const suggestedNumbers = useMemo(() => {
    const suggestions: { number: number; label: string; priority: number }[] = [];

    // Find next available number after the highest
    const maxNumber = Math.max(0, ...existingNumbers);
    let nextAvailable = maxNumber + 1;
    while (usedNumbers.has(nextAvailable)) {
      nextAvailable++;
    }
    suggestions.push({
      number: nextAvailable,
      label: "Siguiente disponible",
      priority: 1,
    });

    // Find gaps in numbering (unused numbers between used ones)
    for (let i = 1; i <= maxNumber; i++) {
      if (!usedNumbers.has(i)) {
        suggestions.push({
          number: i,
          label: "Número libre",
          priority: 2,
        });
      }
    }

    // Sort by priority, then by number
    return suggestions
      .sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return a.number - b.number;
      })
      .slice(0, 5); // Limit to 5 suggestions
  }, [existingNumbers, usedNumbers]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const numValue = parseInt(newValue, 10);
    if (!isNaN(numValue) && numValue > 0) {
      onChange(numValue);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (number: number) => {
    setInputValue(number.toString());
    onChange(number);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  // Update input value when external value changes
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <Label className="flex items-center gap-2 mb-2">
        <Hash className="h-4 w-4 text-gray-500" />
        {label}
      </Label>

      <div className="relative">
        <Input
          ref={inputRef}
          type="number"
          min="1"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          className={`
            pr-10 font-mono font-bold text-lg
            ${isCurrentValueAvailable
              ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-200"
              : "border-rose-300 focus:border-rose-500 focus:ring-rose-200"
            }
          `}
        />

        {/* Status icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isCurrentValueAvailable ? (
            <Check className="h-5 w-5 text-emerald-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-500" />
          )}
        </div>
      </div>

      {/* Availability status */}
      <div className="mt-1.5 flex items-center gap-2 text-xs">
        {isCurrentValueAvailable ? (
          <span className="text-emerald-600 font-medium flex items-center gap-1">
            <Check className="h-3 w-3" />
            Número disponible
          </span>
        ) : (
          <span className="text-rose-600 font-medium flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Ya existe una computadora con este número
          </span>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isFocused && suggestedNumbers.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-[#FF8200]" />
              Sugerencias
            </span>
          </div>

          <div className="py-1">
            {suggestedNumbers.map((suggestion) => (
              <button
                key={suggestion.number}
                type="button"
                onClick={() => handleSuggestionClick(suggestion.number)}
                className={`
                  w-full px-4 py-2.5 flex items-center justify-between
                  hover:bg-[#1859A9]/5 transition-colors
                  ${value === suggestion.number ? "bg-[#1859A9]/10" : ""}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#1859A9]/10 font-mono font-bold text-[#1859A9] text-lg">
                    {suggestion.number}
                  </span>
                  <span className="text-sm text-gray-600">{suggestion.label}</span>
                </div>

                {suggestion.priority === 1 && (
                  <Badge className="bg-[#FF8200]/10 text-[#FF8200] border-[#FF8200]/30 text-xs">
                    Recomendado
                  </Badge>
                )}

                {value === suggestion.number && (
                  <Check className="h-4 w-4 text-[#1859A9]" />
                )}
              </button>
            ))}
          </div>

          {/* Used numbers hint */}
          {usedNumbers.size > 0 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Números en uso: {Array.from(usedNumbers).sort((a, b) => a - b).join(", ")}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
