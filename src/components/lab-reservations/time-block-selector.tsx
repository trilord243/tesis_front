"use client";

import { motion } from "framer-motion";
import { Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  TIME_BLOCKS,
  calculateTotalDuration,
} from "@/types/lab-reservation";

interface TimeBlockSelectorProps {
  selectedBlocks: string[];
  onBlocksChange: (blocks: string[]) => void;
  maxBlocks?: number;
  disabledBlocks?: string[];
}

export function TimeBlockSelector({
  selectedBlocks,
  onBlocksChange,
  maxBlocks = 3,
  disabledBlocks = [],
}: TimeBlockSelectorProps) {
  const handleBlockToggle = (blockValue: string) => {
    if (disabledBlocks.includes(blockValue)) return;

    if (selectedBlocks.includes(blockValue)) {
      onBlocksChange(selectedBlocks.filter((b) => b !== blockValue));
    } else {
      if (selectedBlocks.length < maxBlocks) {
        onBlocksChange([...selectedBlocks, blockValue]);
      }
    }
  };

  const totalDuration = calculateTotalDuration(selectedBlocks);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-gray-700">Bloques Horarios</span>
        </div>
        <div className="text-sm text-gray-500">
          {selectedBlocks.length} / {maxBlocks} bloques
          {selectedBlocks.length > 0 && (
            <span className="ml-2 text-blue-600 font-medium">
              ({totalDuration})
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {TIME_BLOCKS.map((block, index) => {
          const isSelected = selectedBlocks.includes(block.value);
          const isDisabled = disabledBlocks.includes(block.value);
          const isMaxReached =
            selectedBlocks.length >= maxBlocks && !isSelected;

          return (
            <motion.button
              key={block.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              type="button"
              onClick={() => handleBlockToggle(block.value)}
              disabled={isDisabled || isMaxReached}
              className={cn(
                "relative p-4 rounded-xl border-2 transition-all duration-200",
                "flex flex-col items-center justify-center gap-2",
                isSelected
                  ? "bg-blue-50 border-blue-500 shadow-md"
                  : isDisabled
                    ? "bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed"
                    : isMaxReached
                      ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                      : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer"
              )}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2"
                >
                  <Check className="h-5 w-5 text-blue-600" />
                </motion.div>
              )}

              <span
                className={cn(
                  "text-xs font-medium",
                  isSelected ? "text-blue-600" : "text-gray-500"
                )}
              >
                {block.label}
              </span>

              <div
                className={cn(
                  "text-lg font-bold",
                  isSelected ? "text-blue-700" : "text-gray-800"
                )}
              >
                {block.startTime}
              </div>

              <div
                className={cn(
                  "text-sm",
                  isSelected ? "text-blue-600" : "text-gray-600"
                )}
              >
                a {block.endTime}
              </div>

              <span
                className={cn(
                  "text-xs",
                  isSelected ? "text-blue-500" : "text-gray-400"
                )}
              >
                {block.duration}
              </span>

              {isDisabled && (
                <span className="absolute inset-0 flex items-center justify-center bg-gray-200/80 rounded-xl">
                  <span className="text-xs font-medium text-red-600">
                    No disponible
                  </span>
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {selectedBlocks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-4 bg-blue-50 rounded-xl border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">
              Tiempo total reservado:
            </span>
            <span className="text-lg font-bold text-blue-600">
              {totalDuration}
            </span>
          </div>
          <div className="mt-2 text-xs text-blue-600">
            {selectedBlocks
              .sort()
              .map((b) => {
                const block = TIME_BLOCKS.find((tb) => tb.value === b);
                return block ? `${block.startTime}-${block.endTime}` : b;
              })
              .join(", ")}
          </div>
        </motion.div>
      )}

      {selectedBlocks.length >= maxBlocks && (
        <p className="text-sm text-amber-600 flex items-center gap-1">
          <span className="font-medium">Máximo {maxBlocks} bloques por día alcanzado</span>
        </p>
      )}
    </div>
  );
}
