"use client";

import { useCounter } from "@/hooks/use-counter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, RotateCcw, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function CounterDisplay() {
  const { connected } = useWallet();
  const { count, loading, error, lastTx, balance, increment, decrement, reset } = useCounter();

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
      {/* Wallet Connection */}
      <Card className="w-full border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Wallet Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <WalletMultiButton className="!bg-primary !text-primary-foreground hover:!bg-primary/90 !rounded-lg !h-10 !text-sm !font-medium" />
            {connected && balance !== null && (
              <div className="text-sm text-muted-foreground">
                <span className="text-foreground font-mono">{balance.toFixed(4)}</span> SOL
              </div>
            )}
          </div>
          {!connected && (
            <p className="text-sm text-muted-foreground">
              Connect your wallet to receive devnet SOL airdrops
            </p>
          )}
        </CardContent>
      </Card>

      {/* Counter Card */}
      <Card className="w-full border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            SOL Airdrops Received
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 pt-4">
          {/* Counter Display */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
            <div className="relative flex items-center justify-center w-40 h-40 rounded-full border-2 border-primary/30 bg-card">
              <span className="text-6xl font-bold text-foreground font-mono">
                {count}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={decrement}
              disabled={!connected || loading}
              className="w-14 h-14 rounded-full p-0 border-2 border-border hover:border-primary hover:bg-primary/10 transition-all"
              aria-label="Decrement counter"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Minus className="h-6 w-6" />
              )}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={reset}
              disabled={!connected || loading}
              className="w-12 h-12 rounded-full p-0 border border-border hover:border-muted-foreground hover:bg-muted/50 transition-all"
              aria-label="Reset counter"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={increment}
              disabled={!connected || loading}
              className="h-14 px-5 rounded-full border-2 border-primary bg-primary/10 hover:bg-primary/20 transition-all flex items-center gap-2"
              aria-label="Get 1 SOL airdrop"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  <span className="font-semibold">1 SOL</span>
                </>
              )}
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Transaction Info */}
          {lastTx && (
            <div className="flex flex-col items-center gap-1 text-sm">
              <span className="text-muted-foreground">Last Transaction</span>
              <a
                href={`https://explorer.solana.com/tx/${lastTx}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline font-mono text-xs"
              >
                {lastTx.slice(0, 8)}...{lastTx.slice(-8)}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="w-full border-border/50 bg-card/30 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Network</span>
              <span className="text-foreground font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Devnet
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Airdrop Amount</span>
              <span className="text-foreground font-mono text-xs">1 SOL per click</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Status</span>
              <span className={connected ? "text-primary" : "text-muted-foreground"}>
                {connected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
