import React, { useState, useEffect, useCallback } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import Counter from './components/Counter';
import '@solana/wallet-adapter-react-ui/styles.css';
import './App.css';

const SOLANA_CONNECTION = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

function AppContent() {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState(0);
  const [previousBalance, setPreviousBalance] = useState(0);
  const [balanceCounter, setBalanceCounter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchBalance = useCallback(async () => {
    if (!publicKey) return;
    try {
      setLoading(true);
      const balanceLamports = await SOLANA_CONNECTION.getBalance(publicKey);
      const balanceSOL = balanceLamports / LAMPORTS_PER_SOL;
      setBalance(balanceSOL);

      if (previousBalance !== 0) {
        const diff = balanceSOL - previousBalance;
        if (Math.abs(diff - 1) < 0.0001) {
          setBalanceCounter(prev => prev + 1);
          setLastUpdate(new Date().toLocaleTimeString());
        } else if (Math.abs(diff + 1) < 0.0001) {
          setBalanceCounter(prev => Math.max(0, prev - 1));
          setLastUpdate(new Date().toLocaleTimeString());
        }
      }

      setPreviousBalance(balanceSOL);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setLoading(false);
    }
  }, [publicKey, previousBalance]);

  useEffect(() => {
    if (!connected) {
      setBalance(0);
      setPreviousBalance(0);
      setBalanceCounter(0);
      setLastUpdate(null);
      return;
    }
    fetchBalance();
    const interval = setInterval(fetchBalance, 5000);
    return () => clearInterval(interval);
  }, [connected, fetchBalance]);

  return (
    <div className="app-container">
      <div className="header">
        <h1>Solana Dapps Counter</h1>
        <p className="subtitle">Track Your SOL Balance Changes</p>
      </div>
      <div className="wallet-section">
        <WalletMultiButton />
      </div>
      {connected && publicKey ? (
        <div className="content">
          <div className="info-card">
            <h2>Wallet Address</h2>
            <p className="address">{publicKey.toBase58()}</p>
          </div>
          <div className="info-card">
            <h2>Current Balance</h2>
            <p className="balance">{balance.toFixed(4)} SOL</p>
          </div>
          <Counter count={balanceCounter} lastUpdate={lastUpdate} />
          <div className="info-card">
            <p className="status">{loading ? 'Updating...' : 'Monitoring balance changes'}</p>
          </div>
        </div>
      ) : (
        <div className="connect-prompt">
          <p>Please connect your Solana wallet to start tracking balance changes.</p>
        </div>
      )}
    </div>
  );
}

function App() {
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ];

  return (
    <WalletProvider wallets={wallets} autoConnect={true}>
      <WalletModalProvider>
        <AppContent />
      </WalletModalProvider>
    </WalletProvider>
  );
}

export default App;