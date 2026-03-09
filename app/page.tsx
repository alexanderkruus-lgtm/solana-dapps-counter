"use client";

import { WalletProvider } from "@/components/solana/wallet-provider";
import { CounterDisplay } from "@/components/solana/counter-display";
import { Header } from "@/components/solana/header";

export default function Home() {
  return (
    <WalletProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-3 text-balance">
              Decentralized Counter
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto text-pretty">
              A simple counter application running on Solana devnet. Each action creates an on-chain transaction.
            </p>
          </div>

          <CounterDisplay />
        </main>

        <footer className="border-t border-border/50 py-6">
          <div className="max-w-5xl mx-auto px-4 flex items-center justify-between text-sm text-muted-foreground">
            <p>Built with Next.js & Solana</p>
            <p>Network: Devnet</p>
          </div>
        </footer>
      </div>
    </WalletProvider>
  );
}
