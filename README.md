# Token Dove

**Solana Wallet Dashboard & Minimal Game Asset Platform**

---

The application is available on [tokendove.com](https://tokendove.com/). Users can sign in with their [Phantom](https://phantom.com/) wallet and interact with **non-transferable in-game assets** on Solana Devnet.

> ⚠️ **Demo / Devnet Only:** This project is for demonstration purposes and interacts only with Solana Devnet. No mainnet assets are used.

---

## Development

Tests for the on-chain portion of the app can be run using

```
anchor test
```

A local solana test ledger can be started with

```
solana-test-validator
```
exposing an RPC URL entrypoint at `http://127.0.0.1:8899`. 

In the root directory of the project, create a `.env` with the following variables for local development:

```
VITE_PHANTOM_PROJECT_ID=YOUR_PUBLIC_PHANTOM_APP_ID
VITE_RPC_URL="http://127.0.0.1:8899"
VITE_REDIRECT="http://localhost:5173/#/home"
```

Install dependencies and run the off-chain application locally:

```bash
npm install
npm run dev
```

Sign in with phantom and view your transaction history to get your wallet's address. To fund your local account, we can run the following command with your wallet's address:

`solana airdrop 10 <PHANTOM_WALLET_ADDRESS> --url localhost`

If you refresh your transaction history should show the updated balance in your wallet.

### On-Chain Programs

The on-chain portion is written in Rust using [Anchor](https://www.anchor-lang.com/) and implements **non-transferable game asset tokens** using Token-2022:

* Create limited-supply **item mints**
* Track minted supply on-chain to enforce caps
* Allow players to **claim tokens** into their wallets
* Ensure tokens **cannot be transferred**, preventing secondary markets or unintended trading

The on-chain program is minimal, with only two core instructions:

1. `create_item_mint` – for admins to create a new item with a fixed supply
2. `claim_item` – for players to claim a single token

Currently, the programs are not deployed to Devnet/Mainnet. You can build and run tests locally:

```bash
cd on-chain/
anchor build
anchor test
```

---

## Architecture Overview

* The **front-end** is a Svelte application that handles wallet connections (via Phantom) and displays claimed in-game assets.
* The **on-chain Anchor program** manages token minting, supply tracking, and enforces **non-transferable ownership**.
* Metadata such as item images, names, and attributes are handled off-chain by the frontend, linked to each token by mint address or ID.
* This separation keeps the on-chain program **simple and secure**, while giving the frontend full flexibility to display assets.

---

## Current Features

* Connect to Solana wallets (Phantom)
* Display wallet address and claimed items
* Claim **non-transferable game tokens** from limited-supply mints
* On-chain Anchor program using Token-2022 (tested locally)

---

## Future Goals

* Expand inventory system with additional item types
* Implement optional backend entitlement logic for game-based rewards
* Provide a clean, browser-native platform for in-game assets
* Keep the platform **open-source, lightweight, and secure**

---

## Tech Stack

* **Rust / Anchor** – on-chain program for non-transferable tokens
* **JavaScript (ES6+) / Svelte** – front-end and wallet integration
* **Solana RPC** – for on-chain state and token account queries
* **Phantom Wallet** – wallet login and token storage

