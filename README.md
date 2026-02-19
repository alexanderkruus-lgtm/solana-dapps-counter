# 🔢 Solana Counter Program

A simple on-chain counter program built on **Solana** using the **Anchor framework**. This project demonstrates the basics of writing, deploying, and interacting with a Solana smart contract (program).

---

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Running Tests](#running-tests)
- [Deployment](#deployment)
- [Program Instructions](#program-instructions)
- [Contributing](#contributing)
- [License](#license)

---

## 🧩 Overview

The Solana Counter program allows users to:

- **Initialize** a new counter account
- **Increment** the counter by 1
- **Decrement** the counter by 1
- **Reset** the counter back to 0

All counter state is stored on-chain in a Solana account.

---

## ✅ Prerequisites

Make sure you have the following installed:

| Tool | Version | Install |
|------|---------|---------|
| Rust | `>= 1.70` | [rustup.rs](https://rustup.rs) |
| Solana CLI | `>= 1.18` | [docs.solana.com](https://docs.solana.com/cli/install-solana-cli-tools) |
| Anchor CLI | `>= 0.29` | [anchor-lang.com](https://www.anchor-lang.com/docs/installation) |
| Node.js | `>= 18.x` | [nodejs.org](https://nodejs.org) |
| Yarn / npm | latest | bundled with Node.js |

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/solana-counter.git
cd solana-counter
```

### 2. Install JavaScript dependencies

```bash
yarn install
# or
npm install
```

### 3. Build the program

```bash
anchor build
```

### 4. Sync program keys

```bash
anchor keys sync
```

---

## 📁 Project Structure

```
solana-counter/
├── programs/
│   └── counter/
│       └── src/
│           └── lib.rs          # Main program logic
├── tests/
│   └── counter.ts              # Integration tests
├── app/                        # Optional frontend (if included)
├── migrations/
│   └── deploy.ts               # Deployment script
├── Anchor.toml                 # Anchor configuration
├── Cargo.toml                  # Rust workspace config
└── package.json
```

---

## 🛠 Usage

### Configure local validator

```bash
solana config set --url localhost
```

### Start the local test validator

```bash
solana-test-validator
```

### Deploy to localnet

```bash
anchor deploy
```

### Interact via CLI (example)

```bash
# Airdrop SOL to your wallet
solana airdrop 2

# Check your wallet balance
solana balance
```

---

## 🧪 Running Tests

```bash
anchor test
```

This will automatically:
1. Start a local validator
2. Build & deploy the program
3. Run the test suite in `tests/counter.ts`

Expected output:

```
  counter
    ✔ Initializes the counter (450ms)
    ✔ Increments the counter (320ms)
    ✔ Decrements the counter (310ms)
    ✔ Resets the counter (290ms)

  4 passing (1s)
```

---

## 🌐 Deployment

### Devnet

```bash
solana config set --url devnet
solana airdrop 2
anchor deploy --provider.cluster devnet
```

### Mainnet

```bash
solana config set --url mainnet-beta
anchor deploy --provider.cluster mainnet
```

> ⚠️ **Note:** Make sure your wallet has enough SOL to cover deployment costs before deploying to mainnet.

---

## 📜 Program Instructions

### `initialize`
Creates a new counter account with an initial value of `0`.

```typescript
await program.methods
  .initialize()
  .accounts({ counter: counterKeypair.publicKey, user: wallet.publicKey, systemProgram: SystemProgram.programId })
  .signers([counterKeypair])
  .rpc();
```

### `increment`
Increases the counter value by `1`.

```typescript
await program.methods
  .increment()
  .accounts({ counter: counterPublicKey })
  .rpc();
```

### `decrement`
Decreases the counter value by `1`.

```typescript
await program.methods
  .decrement()
  .accounts({ counter: counterPublicKey })
  .rpc();
```

### `reset`
Resets the counter value to `0`.

```typescript
await program.methods
  .reset()
  .accounts({ counter: counterPublicKey })
  .rpc();
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please make sure your code passes all existing tests before submitting.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<p align="center">Built with ❤️ on <a href="https://solana.com">Solana</a> using <a href="https://anchor-lang.com">Anchor</a></p>
