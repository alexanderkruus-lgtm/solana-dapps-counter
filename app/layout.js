import { Analytics } from "@vercel/analytics/next";
import "../src/index.css";

export const metadata = {
  title: "Solana Counter dApp",
  description: "A minimal Solana counter application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
