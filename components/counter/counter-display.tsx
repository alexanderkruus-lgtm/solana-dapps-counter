"use client";

import { Loader2 } from "lucide-react";

interface CounterDisplayProps {
  count: number | null;
  isLoading: boolean;
}

export function CounterDisplay({ count, isLoading }: CounterDisplayProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (count === null) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-2">
        <p className="text-5xl font-mono font-bold tracking-tighter text-muted-foreground">
          --
        </p>
        <p className="text-sm text-muted-foreground">
          Counter not yet initialized
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="flex items-baseline gap-2">
        <p className="text-7xl font-mono font-bold tracking-tighter text-foreground tabular-nums">
          {count.toLocaleString()}
        </p>
        <span className="text-2xl font-semibold text-[#14F195]">SOL</span>
      </div>
      <p className="text-sm text-muted-foreground mt-2">+1 SOL per increment</p>
    </div>
  );
}
