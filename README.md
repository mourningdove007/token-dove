# Token Dove

**Solana Wallet Dashboard & Future NFT/Game Platform**

---

The application is available on [tokendove.com](https://tokendove.com/). In its current form, users can sign in with their [Phantom](https://phantom.com/) wallet and view their transaction history on the Solana Devnet.

> ⚠️ **Demo / Devnet Only:** This project is for demonstration purposes and interacts only with Solana Devnet. No mainnet assets are used.

---

## Development

Install dependencies and run the off-chain application locally:

```bash
npm install
npm run dev
```

### On-Chain SPL Programs

The on-chain portion is written in Rust using [Anchor](https://www.anchor-lang.com/) and implements basic SPL token functionality:

* Creating a token mint
* Creating associated token accounts
* Minting tokens

Currently, the programs are not deployed to Devnet/Mainnet. You can build and run tests locally:

```bash
cd on-chain/
anchor build
anchor test
```

---

## Architecture Overview

* The **front-end** is a Svelte application that handles wallet connections (via Phantom) and displays transaction history.
* The **on-chain Anchor program** interacts with the **SPL Token program**, allowing users to create mints, token accounts, and mint tokens.
* This separation ensures that the heavy lifting (token logic) is handled securely on-chain, while the UI remains lightweight and user-friendly.

---

## Current Features

* Connect to Solana wallets (Phantom)
* Display wallet address
* Fetch and list recent Devnet transactions
* Functioning SPL Program written with Anchor/Rust (tested locally)

---

## Future Goals

* Support **NFT transfers and trading** in-browser
* Provide **SOL and token swap** functionality for games
* Build **user-first tools** with zero server cost and full privacy
* Develop a **browser-native platform** for gaming token ecosystems

---

## Tech Stack

* **Rust / Anchor** – for on-chain programs
* **JavaScript (ES6+)** and **Svelte** – for front-end
* **Solana RPC** – for fetching on-chain data
* **Phantom Wallet** – for wallet integration
* **Firebase Hosting** – for deployment
