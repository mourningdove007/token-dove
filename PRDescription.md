## PR Summary (Completed)

This PR updates the token minting workflow to support **indivisible, soulbound-style tokens** using SPL Token-2022. The mint is configured to produce whole-item tokens, distributed by an admin, locked via freezing, and finalized by renouncing mint authorities to ensure a permanent fixed-supply state.

---

### ✅ Implemented Changes

#### 1️⃣ Mint Decimals Set to 0

Mint configuration was updated so tokens are **indivisible**:

```rust
mint::decimals = 0
```

Each token now represents exactly **one whole item**.

---

#### 2️⃣ Freeze Authority Assigned to Admin

Freeze authority was corrected to use the **admin signer** instead of the mint itself:

```rust
mint::freeze_authority = signer.key()
```

This allows the admin to freeze player token accounts after distribution.

---

#### 3️⃣ Token Distribution to Players

Token distribution was enabled by minting tokens directly to player associated token accounts (ATAs). Admin can now mint **1 or more tokens per player**, ensuring recipient accounts exist prior to minting (either explicitly or via ATA initialization logic).

---

#### 4️⃣ Player Token Accounts Can Be Frozen

A freeze workflow was added using SPL Token-2022 `freeze_account` CPI calls. Once frozen:

* tokens cannot be transferred out
* tokens cannot be transferred in

Frozen accounts function as **soulbound inventories**.

---

#### 5️⃣ Mint and Freeze Authorities Can Be Renounced

A renounce step was added using SPL Token-2022 `set_authority`, setting both authorities to `None`:

```text
mint_authority = None
freeze_authority = None
```

This permanently prevents:

* any further minting
* any unfreezing

Tokens become **fixed-supply and permanently non-transferable**.

---

## Frontend Recommendation (Not Included in This PR)

### 8️⃣ Frontend Mapping

Frontend/backend should maintain a mapping of:

`mint_pubkey → item metadata`

Item attributes such as name, stats, and images should remain **off-chain**, while wallets (Phantom) will only display balances. The frontend interprets token ownership into game meaning.

---

## Final Workflow

```
Admin creates mint (decimals=0, freeze_authority=admin)
→ Mint tokens to player ATAs
→ Freeze all player token accounts
→ Remove mint and freeze authority
→ Tokens are now soulbound
```

* Minimal Anchor changes
* No PDAs required
* No Token-2022 extensions needed
* No Metaplex dependency
* Easy to replicate for additional in-game items
