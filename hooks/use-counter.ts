"use client";

import { useCallback, useEffect, useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import type { Counter } from "@/anchor/idl";
import { toast } from "sonner";

interface UseCounterReturn {
  count: number | null;
  isLoading: boolean;
  isIncrementing: boolean;
  isDecrementing: boolean;
  error: string | null;
  increment: () => Promise<void>;
  decrement: () => Promise<void>;
  refresh: () => Promise<void>;
}

function getExplorerUrl(signature: string): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
}

export function useCounter(
  program: anchor.Program<Counter>,
  counterAddress: PublicKey,
  publicKey: PublicKey | null
): UseCounterReturn {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [isDecrementing, setIsDecrementing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = useCallback(async () => {
    try {
      setError(null);
      const accountData = await (
        program.account as Record<string, { fetch: (addr: PublicKey) => Promise<{ count: anchor.BN }> }>
      ).counter.fetch(counterAddress);
      setCount(Number(accountData.count));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (
        message.includes("Account does not exist") ||
        message.includes("could not find account")
      ) {
        setCount(null);
      } else {
        console.log("[v0] fetchCount error:", message);
        setError("Failed to fetch counter");
      }
    } finally {
      setIsLoading(false);
    }
  }, [program, counterAddress]);

  useEffect(() => {
    fetchCount();

    const subscriptionId = program.provider.connection.onAccountChange(
      counterAddress,
      async () => {
        await fetchCount();
      }
    );

    return () => {
      program.provider.connection.removeAccountChangeListener(subscriptionId);
    };
  }, [program, counterAddress, fetchCount]);

  const getVaultAddress = useCallback(
    (user: PublicKey): PublicKey => {
      return PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), user.toBuffer()],
        program.programId
      )[0];
    },
    [program.programId]
  );

  const increment = useCallback(async () => {
    if (!publicKey) return;
    setIsIncrementing(true);
    setError(null);
    try {
      const vault = getVaultAddress(publicKey);
      const tx = await program.methods
        .increment()
        .accountsStrict({
          user: publicKey,
          counter: counterAddress,
          vault,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      toast.success("Counter incremented!", {
        description: "View on Solana Explorer",
        action: {
          label: "View TX",
          onClick: () => window.open(getExplorerUrl(tx), "_blank"),
        },
      });
      await fetchCount();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Transaction failed";
      console.log("[v0] increment error:", message);
      toast.error("Increment failed", { description: message });
    } finally {
      setIsIncrementing(false);
    }
  }, [program, publicKey, counterAddress, fetchCount, getVaultAddress]);

  const decrement = useCallback(async () => {
    if (!publicKey) return;
    setIsDecrementing(true);
    setError(null);
    try {
      const vault = getVaultAddress(publicKey);
      const tx = await program.methods
        .decrement()
        .accountsStrict({
          user: publicKey,
          counter: counterAddress,
          vault,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      toast.success("Counter decremented!", {
        description: "View on Solana Explorer",
        action: {
          label: "View TX",
          onClick: () => window.open(getExplorerUrl(tx), "_blank"),
        },
      });
      await fetchCount();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Transaction failed";
      console.log("[v0] decrement error:", message);
      toast.error("Decrement failed", { description: message });
    } finally {
      setIsDecrementing(false);
    }
  }, [program, publicKey, counterAddress, fetchCount, getVaultAddress]);

  return {
    count,
    isLoading,
    isIncrementing,
    isDecrementing,
    error,
    increment,
    decrement,
    refresh: fetchCount,
  };
}
