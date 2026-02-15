
# 📝 Dev Guidelines — On-Chain Token Workflow (3 Signature Version)

### 1️⃣ Connect Wallet

**Instruction:** N/A — UI only

* Dev logs in via Phantom (or another Solana wallet).
* Only allow dev/admin wallets to access the dashboard.
* Display connected wallet pubkey for verification.

---

## 2️⃣ Create Mint (Signature #1)

**On-Chain Function:** `create_mint`
**UI Action:** Button: **Create Mint**
**Inputs:**

* None (wallet is payer/admin)

**Notes:**

* Creates a new mint with:

  * `decimals = 0` → indivisible tokens
  * `mint_authority = admin`
  * `freeze_authority = admin`
* Output: **mint public key**
* UI should display mint pubkey with a **copy button**

---

## 3️⃣ Mint + Freeze Tokens to Players (Signature #2)

**On-Chain Function:** `mint_and_freeze_players` *(new combined instruction)*
**UI Action:** Button: **Distribute + Freeze Tokens**
**Inputs:**

* Mint address (from step 2)
* List of up to 10 player wallet addresses (textarea or CSV)
* Amount per player (default 1)

**Notes:**

* Creates player ATAs automatically if they don’t exist.
* Mints tokens to each player ATA.
* Immediately freezes each player token account after minting.
* Tokens become effectively “soulbound” once frozen.
* Dev signs once via Phantom for the batch.
* UI should show progress log per player (minted → frozen)

---

## 4️⃣ Renounce Authorities (Finalize Mint) (Signature #3)

**On-Chain Function:** `renounce_authorities`
**UI Action:** Button: **Finalize Mint / Renounce**
**Inputs:**

* Mint address

**Notes:**

* Removes:

  * mint authority (`None`)
  * freeze authority (`None`)
* No further minting possible.
* Frozen accounts remain locked permanently.
* This action is irreversible — display a strong confirmation modal.

---

# 5️⃣ Optional UI Notes

* Display transaction signatures after each action for auditing.
* Show a simple progress log per player during mint/freeze.
* Enforce dev/admin wallet check at the top.
* Keep batch size ≤ 10 for simplicity.
* Store the mint address in UI state after creation (auto-fill next steps).

---

# ✅ Workflow Summary (3 Signatures)

```
Connect Wallet → Create Mint → Distribute + Freeze Tokens → Renounce Authorities
```

* All steps executed via UI buttons.
* Dev signs 3 times total.
* Minimal complexity (no PDA required).
* Dev only needs to track the mint address for cloud validation / game logic.
