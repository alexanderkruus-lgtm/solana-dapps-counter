"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CounterDisplayProps {
  count: number | null;
  isLoading: boolean;
}

export function CounterDisplay({ count, isLoading }: CounterDisplayProps) {
  const [displayCount, setDisplayCount] = useState(count);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count !== null && prevCount.current !== null && count !== prevCount.current) {
      setIsAnimating(true);
      const timeout = setTimeout(() => {
        setDisplayCount(count);
        setIsAnimating(false);
      }, 150);
      prevCount.current = count;
      return () => clearTimeout(timeout);
    } else {
      setDisplayCount(count);
      prevCount.current = count;
    }
  }, [count]);

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
      <div className="relative overflow-hidden">
        <p
          className={`text-7xl font-mono font-bold tracking-tighter text-foreground tabular-nums transition-all duration-150 ${
            isAnimating ? "scale-110 text-[#14F195]" : "scale-100"
          }`}
        >
          {(displayCount ?? 0).toLocaleString()}
        </p>
      </div>
      <p className="text-sm text-muted-foreground mt-2">current count</p>
    </div>
  );
}
