import "./globals.css";
import { ReactNode } from "react";
import { WalletContextProvider } from "../components/WalletContextProvider";

export const metadata = {
  title: "Solana Counter dApp",
  description: "PDA-based counter with authority and token-gated increments",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}