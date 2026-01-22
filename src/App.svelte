<script>
  import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

  let publicKeyInput = "";
  let transactions = [];
  let loading = false;
  let error = "";

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  async function fetchTransactions() {
    error = "";
    transactions = [];
    if (!publicKeyInput) return;
    loading = true;

    try {
      const publicKey = new PublicKey(publicKeyInput);

      const sigs = await connection.getSignaturesForAddress(publicKey, { limit: 5 });
      if (!sigs.length) {
        error = "No recent transactions found for this address.";
        loading = false;
        return;
      }

      for (const sigInfo of sigs) {
        const tx = await connection.getTransaction(sigInfo.signature, { commitment: "confirmed" });
        if (!tx) continue;

        const blockTime = tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : "Unknown";
        const signature = tx.transaction.signatures[0];
        const preBalances = tx.meta.preBalances;
        const postBalances = tx.meta.postBalances;
        const keys = tx.transaction.message.accountKeys;

        const instr = tx.transaction.message.instructions[0];
        const fromIndex = instr.accounts[0];
        const toIndex = instr.accounts[1] !== undefined ? instr.accounts[1] : instr.accounts[0];

        const from = keys[fromIndex];
        const to = keys[toIndex];
        const amount = ((preBalances[fromIndex] - postBalances[fromIndex]) / LAMPORTS_PER_SOL).toFixed(6);

        transactions = [
          ...transactions,
          { from, to, amount, signature, blockTime }
        ];
      }

    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<style>

  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .controls {
    max-width: 500px;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  input {
    padding: 0.6rem;
    font-size: 1rem;
    border: 1px solid #aaa;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
  }

  button {
    padding: 0.6rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    background: #444;
    color: white;
    cursor: pointer;
  }

  button:hover {
    background: #222;
  }

  .transaction {
    background: #222;
    border: 1px solid #ddd;
    max-width: 500px;
    border-radius: 6px;
    padding: 0.8rem;
    margin-top: 1rem;
    word-break: break-all;
    text-align: left;
  }

  .footer {
    text-align: center;
    font-size: 0.8rem;
    color: white;
    margin-top: 3rem;
  }


  .footer a:hover {
    text-decoration: underline;
  }
</style>

<h1>Solana Devnet Ledger</h1>

<div class="controls">
  <input bind:value={publicKeyInput} placeholder="Enter Solana public key" />
  <button on:click={fetchTransactions}>Submit</button>
</div>

{#if loading}
  <p style="text-align:center; margin-top: 1rem;">Fetching transactions…</p>
{/if}

{#if error}
  <p style="color:red; text-align:center; margin-top:1rem">{error}</p>
{/if}

{#each transactions as tx (tx.signature)}
  <div class="transaction">
    <div>From: {tx.from}</div>
    <div>To: {tx.to}</div>
    <div>Amount (SOL): {tx.amount}</div>
    <div>Signature: <div>{tx.signature}</div></div>
    <div>Time: {tx.blockTime}</div>
  </div>
{/each}

<div class="footer">
  <a href="https://github.com/mourningdove007/token-dove" target="_blank">Token Dove</a> • Devnet Edition • Printed from the Solana blockchain
</div>
