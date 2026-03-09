"use client";

import { useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

// Simple counter program that stores data in a PDA
// For demo purposes, we'll use localStorage to track counter state
// In production, you'd use an actual deployed Solana program

const COUNTER_SEED = "solana-counter-v1";

interface CounterState {
  count: number;
  lastTxSignature: string | null;
}

export function useCounter() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTx, setLastTx] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  // Get storage key based on wallet
  const getStorageKey = useCallback(() => {
    return publicKey ? `${COUNTER_SEED}-${publicKey.toBase58()}` : null;
  }, [publicKey]);

  // Load counter state from localStorage
  useEffect(() => {
    const storageKey = getStorageKey();
    if (storageKey) {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const state: CounterState = JSON.parse(stored);
        setCount(state.count);
        setLastTx(state.lastTxSignature);
      } else {
        setCount(0);
        setLastTx(null);
      }
    }
  }, [getStorageKey]);

  // Save counter state to localStorage
  const saveState = useCallback(
    (newCount: number, txSignature: string | null) => {
      const storageKey = getStorageKey();
      if (storageKey) {
        const state: CounterState = { count: newCount, lastTxSignature: txSignature };
        localStorage.setItem(storageKey, JSON.stringify(state));
      }
    },
    [getStorageKey]
  );

  // Fetch wallet balance
  useEffect(() => {
    async function fetchBalance() {
      if (publicKey && connection) {
        try {
          const bal = await connection.getBalance(publicKey);
          setBalance(bal / LAMPORTS_PER_SOL);
        } catch {
          setBalance(null);
        }
      } else {
        setBalance(null);
      }
    }
    fetchBalance();
    // Set up interval to refresh balance
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [publicKey, connection]);

  // Create a memo transaction to record the counter action on-chain
  const createMemoTransaction = useCallback(
    async (action: "increment" | "decrement", newValue: number) => {
      if (!publicKey) throw new Error("Wallet not connected");

      const memoProgram = new PublicKey(
        "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
      );

      const memoData = Buffer.from(
        JSON.stringify({
          action,
          newValue,
          timestamp: Date.now(),
          dapp: "solana-counter",
        })
      );

      const instruction = new TransactionInstruction({
        keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
        programId: memoProgram,
        data: memoData,
      });

      const transaction = new Transaction().add(instruction);
      
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      return transaction;
    },
    [publicKey, connection]
  );

  // Helper to delay between retries
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Try multiple RPC endpoints for airdrop with retry logic
  const requestSolAirdropWithRetry = useCallback(async (): Promise<string> => {
    if (!publicKey) throw new Error("Wallet not connected");

    const AIRDROP_AMOUNT = 1 * LAMPORTS_PER_SOL; // 1 SOL
    const MAX_RETRIES = 5;
    const RETRY_DELAY = 2000; // 2 seconds between retries

    // Multiple devnet RPC endpoints to try
    const rpcEndpoints = [
      "https://api.devnet.solana.com",
      "https://devnet.helius-rpc.com/?api-key=15319bf4-5b40-4958-ac8d-6313aa55eb92",
      "https://rpc.ankr.com/solana_devnet",
    ];

    let lastError: Error | null = null;

    // Try each endpoint with retries
    for (const endpoint of rpcEndpoints) {
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          // Create a new connection for this endpoint
          const { Connection } = await import("@solana/web3.js");
          const altConnection = new Connection(endpoint, "confirmed");
          
          const signature = await altConnection.requestAirdrop(
            publicKey,
            AIRDROP_AMOUNT
          );

          // Wait for confirmation using the same connection
          await altConnection.confirmTransaction(signature, "confirmed");
          
          return signature;
        } catch (err) {
          lastError = err instanceof Error ? err : new Error(String(err));
          const errorMsg = lastError.message.toLowerCase();
          
          // If rate limited, wait and retry
          if (errorMsg.includes("429") || errorMsg.includes("rate") || errorMsg.includes("too many")) {
            await delay(RETRY_DELAY * (attempt + 1)); // Exponential backoff
            continue;
          }
          
          // For other errors, try next endpoint
          break;
        }
      }
    }

    // If all endpoints failed, throw the last error
    throw lastError || new Error("All airdrop attempts failed");
  }, [publicKey]);

  const increment = useCallback(async () => {
    if (!connected || !publicKey) {
      setError("Please connect your wallet first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newCount = count + 1;
      
      // Request 1 SOL airdrop with retry logic across multiple endpoints
      const signature = await requestSolAirdropWithRetry();

      setCount(newCount);
      setLastTx(signature);
      saveState(newCount, signature);

      // Refresh balance after airdrop
      const bal = await connection.getBalance(publicKey);
      setBalance(bal / LAMPORTS_PER_SOL);
    } catch (err) {
      console.error("Increment error:", err);
      const errorMessage = err instanceof Error ? err.message : "Transaction failed";
      // Check for rate limit errors
      if (errorMessage.includes("429") || errorMessage.includes("rate") || errorMessage.includes("too many")) {
        setError("All faucets are rate limited. Please wait 1-2 minutes and try again.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [connected, publicKey, count, requestSolAirdropWithRetry, connection, saveState]);

  const decrement = useCallback(async () => {
    if (!connected || !publicKey) {
      setError("Please connect your wallet first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newCount = count - 1;
      const transaction = await createMemoTransaction("decrement", newCount);
      
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, "confirmed");

      setCount(newCount);
      setLastTx(signature);
      saveState(newCount, signature);

      // Refresh balance after transaction
      const bal = await connection.getBalance(publicKey);
      setBalance(bal / LAMPORTS_PER_SOL);
    } catch (err) {
      console.error("Decrement error:", err);
      setError(err instanceof Error ? err.message : "Transaction failed");
    } finally {
      setLoading(false);
    }
  }, [connected, publicKey, count, createMemoTransaction, sendTransaction, connection, saveState]);

  const reset = useCallback(async () => {
    if (!connected || !publicKey) {
      setError("Please connect your wallet first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const transaction = await createMemoTransaction("increment", 0);
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      setCount(0);
      setLastTx(signature);
      saveState(0, signature);

      const bal = await connection.getBalance(publicKey);
      setBalance(bal / LAMPORTS_PER_SOL);
    } catch (err) {
      console.error("Reset error:", err);
      setError(err instanceof Error ? err.message : "Transaction failed");
    } finally {
      setLoading(false);
    }
  }, [connected, publicKey, createMemoTransaction, sendTransaction, connection, saveState]);

  return {
    count,
    loading,
    error,
    lastTx,
    balance,
    increment,
    decrement,
    reset,
    connected,
  };
}
