"use client";

import { SolanaProvider } from "@/components/solana/solana-provider";
import { WalletButton } from "@/components/solana/wallet-button";
import { CounterCard } from "@/components/counter/counter-card";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <SolanaProvider>
      <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 py-12 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#14F195]/5 via-transparent to-transparent pointer-events-none" />

        <header className="relative flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <SolanaLogo />
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Counter dApp
            </h1>
          </div>
          <WalletButton />
        </header>

        <section className="relative w-full max-w-md">
          <CounterCard />
        </section>

        <footer className="relative text-center text-xs text-muted-foreground/50 space-y-1">
          <p>
            Powered by{" "}
            <a
              href="https://www.anchor-lang.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
            >
              Anchor
            </a>
            {", "}
            <a
              href="https://solana-labs.github.io/solana-web3.js/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
            >
              Web3.js
            </a>
            {", and "}
            <a
              href="https://ui.shadcn.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
            >
              shadcn/ui
            </a>
          </p>
          <p>A minimal Solana dApp on Devnet</p>
        </footer>
      </main>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "hsl(240 6% 10%)",
            border: "1px solid hsl(240 4% 16%)",
            color: "hsl(0 0% 98%)",
          },
        }}
      />
    </SolanaProvider>
  );
}

function SolanaLogo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="solana-grad"
          x1="0"
          y1="0"
          x2="128"
          y2="128"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#14F195" />
          <stop offset="1" stopColor="#9945FF" />
        </linearGradient>
      </defs>
      <circle cx="64" cy="64" r="64" fill="url(#solana-grad)" />
      <path
        d="M38.2 82.4c.5-.5 1.2-.8 2-.8h51.6c1.3 0 1.9 1.5.9 2.4l-10.4 10.2c-.5.5-1.2.8-2 .8H28.7c-1.3 0-1.9-1.5-.9-2.4L38.2 82.4z"
        fill="white"
      />
      <path
        d="M38.2 33.8c.5-.5 1.3-.8 2-.8h51.6c1.3 0 1.9 1.5.9 2.4L82.4 45.6c-.5.5-1.2.8-2 .8H28.7c-1.3 0-1.9-1.5-.9-2.4L38.2 33.8z"
        fill="white"
      />
      <path
        d="M82.4 57.8c-.5-.5-1.2-.8-2-.8H28.7c-1.3 0-1.9 1.5-.9 2.4l10.4 10.2c.5.5 1.2.8 2 .8h51.6c1.3 0 1.9-1.5.9-2.4L82.4 57.8z"
        fill="white"
      />
    </svg>
  );
}
