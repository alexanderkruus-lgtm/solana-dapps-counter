"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus, Loader2 } from "lucide-react";

interface CounterButtonsProps {
  onIncrement: () => void;
  onDecrement: () => void;
  isIncrementing: boolean;
  isDecrementing: boolean;
  disabled: boolean;
}

export function CounterButtons({
  onIncrement,
  onDecrement,
  isIncrementing,
  isDecrementing,
  disabled,
}: CounterButtonsProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="lg"
        className="flex-1 gap-2 h-12 text-base border-border/50 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        onClick={onDecrement}
        disabled={disabled || isDecrementing}
      >
        {isDecrementing ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Minus className="h-5 w-5" />
        )}
        Decrement
      </Button>
      <Button
        size="lg"
        className="flex-1 gap-2 h-12 text-base bg-[#14F195] text-[#09090b] hover:bg-[#14F195]/90 font-semibold transition-colors"
        onClick={onIncrement}
        disabled={disabled || isIncrementing}
      >
        {isIncrementing ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Plus className="h-5 w-5" />
        )}
        Increment
      </Button>
    </div>
  );
}
