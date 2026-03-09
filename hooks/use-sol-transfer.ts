"use client";

import { useCallback, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { toast } from "sonner";

interface UseSolTransferReturn {
  balance: number | null;
  isLoading: boolean;
  isTransferring: boolean;
  transfer: (recipient: string, amount: number) => Promise<void>;
  refreshBalance: () => Promise<void>;
}

function getExplorerUrl(signature: string): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
}

export function useSolTransfer(): UseSolTransferReturn {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  const refreshBalance = useCallback(async () => {
    if (!publicKey) {
      setBalance(null);
      return;
    }
    setIsLoading(true);
    try {
      const lamports = await connection.getBalance(publicKey);
      setBalance(lamports / LAMPORTS_PER_SOL);
    } catch {
      setBalance(null);
    } finally {
      setIsLoading(false);
    }
  }, [connection, publicKey]);

  const transfer = useCallback(
    async (recipient: string, amount: number) => {
      if (!publicKey) {
        toast.error("Wallet not connected");
        return;
      }

      // Validate recipient address
      let recipientPubkey: PublicKey;
      try {
        recipientPubkey = new PublicKey(recipient);
      } catch {
        toast.error("Invalid recipient address");
        return;
      }

      if (amount <= 0) {
        toast.error("Amount must be greater than 0");
        return;
      }

      setIsTransferring(true);
      try {
        const lamports = Math.round(amount * LAMPORTS_PER_SOL);

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: recipientPubkey,
            lamports,
          })
        );

        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = publicKey;

        const signature = await sendTransaction(transaction, connection);

        // Wait for confirmation
        await connection.confirmTransaction({
          signature,
          blockhash,
          lastValidBlockHeight,
        });

        toast.success(`Sent ${amount} SOL!`, {
          description: "View transaction on Solana Explorer",
          action: {
            label: "View TX",
            onClick: () => window.open(getExplorerUrl(signature), "_blank"),
          },
        });

        // Refresh balance after transfer
        await refreshBalance();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Transfer failed";
        const errorName = (err as Error)?.name || "";

        if (
          errorName === "WalletSignTransactionError" ||
          message.includes("WalletSignTransactionError")
        ) {
          toast.error("Wallet signing failed", {
            description:
              "If in preview, deploy to Vercel and test from the deployed URL.",
          });
        } else if (message.includes("User rejected")) {
          toast.error("Transaction cancelled");
        } else if (message.includes("insufficient")) {
          toast.error("Insufficient balance", {
            description: "You don't have enough SOL for this transfer.",
          });
        } else {
          toast.error("Transfer failed", { description: message });
        }
      } finally {
        setIsTransferring(false);
      }
    },
    [publicKey, connection, sendTransaction, refreshBalance]
  );

  return {
    balance,
    isLoading,
    isTransferring,
    transfer,
    refreshBalance,
  };
}
