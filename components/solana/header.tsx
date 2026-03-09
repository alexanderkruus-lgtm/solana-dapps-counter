"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ExternalLink, Loader2, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [isAirdropping, setIsAirdropping] = useState(false);
  const [airdropStatus, setAirdropStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const requestAirdrop = async () => {
    if (!publicKey) {
      setAirdropStatus({ type: "error", message: "Please connect your wallet first" });
      return;
    }

    setIsAirdropping(true);
    setAirdropStatus(null);

    try {
      const signature = await connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL);
      await connection.confirmTransaction(signature, "confirmed");
      setAirdropStatus({ type: "success", message: "1 SOL airdropped successfully!" });
    } catch (error) {
      console.error("Airdrop failed:", error);
      setAirdropStatus({
        type: "error",
        message: "Airdrop failed. Try the faucet link or wait a moment.",
      });
    } finally {
      setIsAirdropping(false);
      setTimeout(() => setAirdropStatus(null), 5000);
    }
  };

  return (
    <header className="w-full border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-md" />
            <svg
              className="relative w-8 h-8"
              viewBox="0 0 397 311"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"
                fill="url(#paint0_linear)"
              />
              <path
                d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"
                fill="url(#paint1_linear)"
              />
              <path
                d="M332.1 120.9c-2.4-2.4-5.7-3.8-9.2-3.8H5.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"
                fill="url(#paint2_linear)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="360.879"
                  y1="-37.455"
                  x2="141.213"
                  y2="383.294"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#00FFA3" />
                  <stop offset="1" stopColor="#DC1FFF" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear"
                  x1="264.829"
                  y1="-87.601"
                  x2="45.163"
                  y2="333.147"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#00FFA3" />
                  <stop offset="1" stopColor="#DC1FFF" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear"
                  x1="312.548"
                  y1="-62.688"
                  x2="92.882"
                  y2="358.061"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#00FFA3" />
                  <stop offset="1" stopColor="#DC1FFF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Counter dApp</h1>
            <p className="text-xs text-muted-foreground">Solana Devnet</p>
          </div>
        </div>

        <nav className="flex items-center gap-3">
          {airdropStatus && (
            <span
              className={`text-xs px-2 py-1 rounded ${
                airdropStatus.type === "success"
                  ? "bg-primary/20 text-primary"
                  : "bg-destructive/20 text-destructive"
              }`}
            >
              {airdropStatus.message}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={requestAirdrop}
            disabled={isAirdropping || !publicKey}
            className="gap-1.5"
          >
            {isAirdropping ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Coins className="h-3.5 w-3.5" />
            )}
            {isAirdropping ? "Airdropping..." : "Airdrop 1 SOL"}
          </Button>
          <a
            href="https://faucet.solana.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Faucet
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://explorer.solana.com/?cluster=devnet"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Explorer
            <ExternalLink className="h-3 w-3" />
          </a>
        </nav>
      </div>
    </header>
  );
}
