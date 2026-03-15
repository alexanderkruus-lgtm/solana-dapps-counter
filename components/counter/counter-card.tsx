"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CounterDisplay } from "./counter-display";
import { CounterButtons } from "./counter-buttons";
import { useProgram } from "@/hooks/use-program";
import { useCounter } from "@/hooks/use-counter";
import { AlertCircle, Wallet, Zap } from "lucide-react";
import { toast } from "sonner";

type Mode = "select" | "demo" | "wallet";

export function CounterCard() {
  const [mode, setMode] = useState<Mode>("select");
  const { program, counterAddress, publicKey, connected } = useProgram();
  const onChainCounter = useCounter(program, counterAddress, publicKey);

  // Demo mode state
  const [demoCount, setDemoCount] = useState(0);
  const [isDemoIncrementing, setIsDemoIncrementing] = useState(false);
  const [isDemoDecrementing, setIsDemoDecrementing] = useState(false);

  const demoIncrement = useCallback(async () => {
    setIsDemoIncrementing(true);
    await new Promise((r) => setTimeout(r, 500));
    setDemoCount((c) => c + 1);
    toast.success("Counter incremented!", {
      description: "Demo transaction simulated",
    });
    setIsDemoIncrementing(false);
  }, []);

  const demoDecrement = useCallback(async () => {
    if (demoCount <= 0) {
      toast.error("Cannot decrement", {
        description: "Counter cannot go below zero",
      });
      return;
    }
    setIsDemoDecrementing(true);
    await new Promise((r) => setTimeout(r, 500));
    setDemoCount((c) => Math.max(0, c - 1));
    toast.success("Counter decremented!", {
      description: "Demo transaction simulated",
    });
    setIsDemoDecrementing(false);
  }, [demoCount]);

  // Mode selection screen
  if (mode === "select") {
    return (
      <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-balance">
            Choose Mode
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Try the demo or connect your wallet to Devnet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            size="lg"
            className="w-full h-16 flex items-center justify-start gap-4 px-6 border-border/50 hover:border-[#14F195]/50 hover:bg-[#14F195]/5 transition-all"
            onClick={() => setMode("demo")}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#14F195]/10">
              <Zap className="h-5 w-5 text-[#14F195]" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">Demo Mode</p>
              <p className="text-xs text-muted-foreground">
                Try the counter without a wallet
              </p>
            </div>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full h-16 flex items-center justify-start gap-4 px-6 border-border/50 hover:border-[#9945FF]/50 hover:bg-[#9945FF]/5 transition-all"
            onClick={() => setMode("wallet")}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#9945FF]/10">
              <Wallet className="h-5 w-5 text-[#9945FF]" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">Wallet Mode</p>
              <p className="text-xs text-muted-foreground">
                Connect wallet for on-chain txs
              </p>
            </div>
          </Button>
        </CardContent>
        <CardFooter className="justify-center pb-6">
          <p className="text-xs text-muted-foreground/60">
            Powered by Solana Devnet
          </p>
        </CardFooter>
      </Card>
    );
  }

  // Demo mode
  if (mode === "demo") {
    return (
      <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2">
            <CardTitle className="text-2xl font-bold text-balance">
              Solana Counter
            </CardTitle>
            <Badge
              variant="secondary"
              className="text-[10px] uppercase tracking-wider bg-[#14F195]/10 text-[#14F195] border-[#14F195]/20"
            >
              Demo
            </Badge>
          </div>
          <CardDescription className="text-muted-foreground">
            Simulated counter interactions
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <CounterDisplay count={demoCount} isLoading={false} />

          <CounterButtons
            onIncrement={demoIncrement}
            onDecrement={demoDecrement}
            isIncrementing={isDemoIncrementing}
            isDecrementing={isDemoDecrementing}
            disabled={false}
          />
        </CardContent>

        <CardFooter className="justify-center pb-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground/60 hover:text-muted-foreground"
            onClick={() => setMode("select")}
          >
            Switch to Wallet Mode
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Wallet mode (original functionality)
  return (
    <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2">
          <CardTitle className="text-2xl font-bold text-balance">
            Solana Counter
          </CardTitle>
          <Badge
            variant="secondary"
            className="text-[10px] uppercase tracking-wider bg-[#9945FF]/10 text-[#9945FF] border-[#9945FF]/20"
          >
            Devnet
          </Badge>
        </div>
        <CardDescription className="text-muted-foreground">
          Interact with an on-chain Anchor program
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <CounterDisplay
          count={onChainCounter.count}
          isLoading={onChainCounter.isLoading}
        />

        {onChainCounter.error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{onChainCounter.error}</span>
          </div>
        )}

        {!connected ? (
          <p className="text-center text-sm text-muted-foreground py-2">
            Connect your wallet to interact with the counter
          </p>
        ) : (
          <CounterButtons
            onIncrement={onChainCounter.increment}
            onDecrement={onChainCounter.decrement}
            isIncrementing={onChainCounter.isIncrementing}
            isDecrementing={onChainCounter.isDecrementing}
            disabled={!connected || onChainCounter.count === null}
          />
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2 pb-6">
        <p className="text-xs text-muted-foreground/60 font-mono truncate max-w-full">
          Program: {counterAddress.toBase58().slice(0, 8)}...
          {counterAddress.toBase58().slice(-8)}
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground/60 hover:text-muted-foreground"
          onClick={() => setMode("select")}
        >
          Switch to Demo Mode
        </Button>
      </CardFooter>
    </Card>
  );
}
