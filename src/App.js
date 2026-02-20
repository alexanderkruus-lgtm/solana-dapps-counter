"use client";

import CounterCard from "../components/CounterCard";
import WalletConnect from "../components/WalletConnect";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCounter } from "../hooks/useCounter";
import { program, web3 } from "../utils/anchorClient";

export default function Home() {
  const { publicKey } = useWallet();

  if (!publicKey) {
    return (
      <div className="main-container">
        <WalletConnect />
      </div>
    );
  }

  const { value, increment, decrement, tokenIncrement, counterPda } =
    useCounter(program, publicKey);

  return (
    <div className="main-container">
      <div>
        <WalletConnect />
        <CounterCard
          value={value}
          increment={increment}
          decrement={decrement}
          tokenIncrement={tokenIncrement}
          counterPda={counterPda}
        />
      </div>
    </div>
  );
}