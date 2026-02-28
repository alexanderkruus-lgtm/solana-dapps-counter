"use client";

import * as anchor from "@coral-xyz/anchor";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useEffect } from "react";

import type { Counter } from "@/anchor/idl";
import Idl from "@/anchor/idl.json";

interface UseProgramReturn {
  program: anchor.Program<Counter>;
  counterAddress: PublicKey;
  publicKey: PublicKey | null;
  connected: boolean;
  connection: anchor.web3.Connection;
}

/**
 * Hook that provides access to the Solana program, counter PDA address,
 * connected wallet, and connection. Handles provider setup and devnet airdrop.
 */
export function useProgram(): UseProgramReturn {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  let program: anchor.Program<Counter>;
  if (wallet) {
    const provider = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: "confirmed",
    });
    program = new anchor.Program<Counter>(Idl as Counter, provider);
  } else {
    program = new anchor.Program<Counter>(Idl as Counter, { connection });
  }

  const counterAddress = PublicKey.findProgramAddressSync(
    [Buffer.from("counter")],
    new PublicKey(Idl.address)
  )[0];

  // Auto-airdrop devnet SOL if balance is low
  useEffect(() => {
    const airdropDevnetSol = async () => {
      if (!publicKey) return;
      try {
        const balance = await connection.getBalance(publicKey);
        if (balance / LAMPORTS_PER_SOL < 1) {
          await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
        }
      } catch (error) {
        console.log("Airdrop failed (may be rate-limited):", error);
      }
    };
    airdropDevnetSol();
  }, [publicKey, connection]);

  return {
    program,
    counterAddress,
    publicKey,
    connected,
    connection,
  };
}
