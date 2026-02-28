"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CounterDisplay } from "./counter-display";
import { CounterButtons } from "./counter-buttons";
import { useProgram } from "@/hooks/use-program";
import { useCounter } from "@/hooks/use-counter";
import { AlertCircle } from "lucide-react";

export function CounterCard() {
  const { program, counterAddress, publicKey, connected } = useProgram();
  const {
    count,
    isLoading,
    isIncrementing,
    isDecrementing,
    error,
    increment,
    decrement,
  } = useCounter(program, counterAddress, publicKey);

  return (
    <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2">
          <CardTitle className="text-2xl font-bold text-balance">
            Solana Counter
          </CardTitle>
          <Badge
            variant="secondary"
            className="text-[10px] uppercase tracking-wider bg-secondary/80 text-muted-foreground"
          >
            Devnet
          </Badge>
        </div>
        <CardDescription className="text-muted-foreground">
          Interact with an on-chain Anchor program
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <CounterDisplay count={count} isLoading={isLoading} />

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!connected ? (
          <p className="text-center text-sm text-muted-foreground py-2">
            Connect your wallet to interact with the counter
          </p>
        ) : (
          <CounterButtons
            onIncrement={increment}
            onDecrement={decrement}
            isIncrementing={isIncrementing}
            isDecrementing={isDecrementing}
            disabled={!connected || count === null}
          />
        )}
      </CardContent>

      <CardFooter className="justify-center pb-6">
        <p className="text-xs text-muted-foreground/60 font-mono truncate max-w-full">
          Program: {counterAddress.toBase58().slice(0, 8)}...
          {counterAddress.toBase58().slice(-8)}
        </p>
      </CardFooter>
    </Card>
  );
}
