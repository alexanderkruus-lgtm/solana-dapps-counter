"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSolTransfer } from "@/hooks/use-sol-transfer";
import { Loader2, Send, Wallet, Info } from "lucide-react";

export function TransferCard() {
  const { publicKey, connected } = useWallet();
  const { balance, isLoading, isTransferring, transfer, refreshBalance } =
    useSolTransfer();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("1");

  // Fetch balance when wallet connects
  useEffect(() => {
    if (connected) {
      refreshBalance();
    }
  }, [connected, refreshBalance]);

  const handleTransfer = async () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return;
    }
    await transfer(recipient, amountNum);
  };

  const isInIframe =
    typeof window !== "undefined" && window.self !== window.top;

  return (
    <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2">
          <CardTitle className="text-2xl font-bold text-balance">
            Send SOL
          </CardTitle>
          <Badge
            variant="secondary"
            className="text-[10px] uppercase tracking-wider bg-secondary/80 text-muted-foreground"
          >
            Devnet
          </Badge>
        </div>
        <CardDescription className="text-muted-foreground">
          Transfer real SOL to any wallet address
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Iframe notice */}
        {isInIframe && (
          <div className="flex items-start gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 text-xs text-blue-300">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              Wallet transactions may fail in preview. Click{" "}
              <strong>Publish</strong> to deploy and test from the live URL.
            </span>
          </div>
        )}

        {/* Balance display */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Your Balance</span>
          </div>
          <div className="text-right">
            {!connected ? (
              <span className="text-sm text-muted-foreground">--</span>
            ) : isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <span className="font-mono font-semibold text-[#14F195]">
                {balance?.toFixed(4) ?? "0"} SOL
              </span>
            )}
          </div>
        </div>

        {!connected ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            Connect your wallet to send SOL
          </p>
        ) : (
          <div className="space-y-4">
            {/* Recipient input */}
            <div className="space-y-2">
              <label
                htmlFor="recipient"
                className="text-sm font-medium text-foreground"
              >
                Recipient Address
              </label>
              <input
                id="recipient"
                type="text"
                placeholder="Enter Solana wallet address..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full rounded-lg border border-border/50 bg-background px-4 py-3 text-sm font-mono placeholder:text-muted-foreground focus:border-[#14F195]/50 focus:outline-none focus:ring-1 focus:ring-[#14F195]/50 transition-colors"
              />
            </div>

            {/* Amount input */}
            <div className="space-y-2">
              <label
                htmlFor="amount"
                className="text-sm font-medium text-foreground"
              >
                Amount (SOL)
              </label>
              <div className="relative">
                <input
                  id="amount"
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder="1.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-border/50 bg-background px-4 py-3 pr-16 text-sm font-mono placeholder:text-muted-foreground focus:border-[#14F195]/50 focus:outline-none focus:ring-1 focus:ring-[#14F195]/50 transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#14F195]">
                  SOL
                </span>
              </div>
              {/* Quick amount buttons */}
              <div className="flex gap-2">
                {[0.1, 0.5, 1, 2].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(String(val))}
                    className="flex-1 rounded-md border border-border/50 bg-muted/30 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                  >
                    {val} SOL
                  </button>
                ))}
              </div>
            </div>

            {/* Transfer button */}
            <Button
              size="lg"
              className="w-full gap-2 h-12 text-base bg-[#14F195] text-[#09090b] hover:bg-[#14F195]/90 font-semibold transition-colors"
              onClick={handleTransfer}
              disabled={
                isTransferring ||
                !recipient ||
                !amount ||
                parseFloat(amount) <= 0
              }
            >
              {isTransferring ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              {isTransferring ? "Sending..." : `Send ${amount || "0"} SOL`}
            </Button>
          </div>
        )}
      </CardContent>

      <CardFooter className="justify-center pb-6">
        {publicKey && (
          <p className="text-xs text-muted-foreground/60 font-mono truncate max-w-full">
            From: {publicKey.toBase58().slice(0, 8)}...
            {publicKey.toBase58().slice(-8)}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
