"use client";

import dynamic from "next/dynamic";

// Dynamically import the WalletMultiButton to avoid SSR issues
const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export function WalletButton() {
  return (
    <WalletMultiButton
      style={{
        backgroundColor: "hsl(240 6% 10%)",
        borderRadius: "0.5rem",
        height: "2.5rem",
        fontSize: "0.875rem",
        fontFamily: "var(--font-inter), sans-serif",
      }}
    />
  );
}
