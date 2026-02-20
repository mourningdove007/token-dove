<script>
    import { onMount } from "svelte";
    import { BROWSERSDK } from "../tools/authorization";

    import {
        Connection,
        PublicKey,
        clusterApiUrl,
        LAMPORTS_PER_SOL,
    } from "@solana/web3.js";

    import { push } from "svelte-spa-router";
    import GlowingButton from "../lib/CustomButtom.svelte";

    let publicKeyInput = $state("");
    let transactions = $state([]);
    let solBalance = $state(null);
    let error = $state("");

    const backHome = async () => {
        await push("/home");
    };

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    async function fetchBalance() {
        if (!publicKeyInput) return;

        try {
            const publicKey = new PublicKey(publicKeyInput);
            const balanceLamports = await connection.getBalance(publicKey);
            solBalance = balanceLamports / LAMPORTS_PER_SOL;
        } catch (err) {
            error = err.message;
        }
    }
    const lastFour = (value) => {
        if (value === null || value === undefined) return "";

        const str = String(value);
        return str.slice(-4);
    };

    async function fetchTransactions() {
        error = "";
        transactions = [];
        if (!publicKeyInput) return;

        try {
            const publicKey = new PublicKey(publicKeyInput);

            const sigs = await connection.getSignaturesForAddress(publicKey, {
                limit: 5,
            });

            if (!sigs.length) {
                error = "No transactions found for this address.";
                return;
            }

            for (const sigInfo of sigs) {
                const tx = await connection.getTransaction(sigInfo.signature, {
                    commitment: "confirmed",
                });

                if (!tx) continue;

                const blockTime = tx.blockTime
                    ? new Date(tx.blockTime * 1000).toLocaleString()
                    : "Unknown";

                const signature = tx.transaction.signatures[0];
                const preBalances = tx.meta.preBalances;
                const postBalances = tx.meta.postBalances;
                const keys = tx.transaction.message.accountKeys;

                const instr = tx.transaction.message.instructions[0];
                const fromIndex = instr.accounts[0];
                const toIndex =
                    instr.accounts[1] !== undefined
                        ? instr.accounts[1]
                        : instr.accounts[0];

                const from = keys[fromIndex];
                const to = keys[toIndex];

                const amount = (
                    (preBalances[fromIndex] - postBalances[fromIndex]) /
                    LAMPORTS_PER_SOL
                ).toFixed(6);

                transactions = [
                    ...transactions,
                    { from, to, amount, signature, blockTime },
                ];
            }
        } catch (err) {
            error = err.message;
        }
    }

    onMount(async () => {
        await BROWSERSDK.connect({ provider: "google" });

        try {
            publicKeyInput = await BROWSERSDK.solana.getPublicKey();

            if (publicKeyInput) {
                await fetchBalance();
                await fetchTransactions();
            }
        } catch (e) {
            error = "Failed to load public key";
            console.error(e);
        }
    });
</script>

<GlowingButton text="Home" onClick={backHome} showIcon={false} />

<h2>
    {`History for ${publicKeyInput.slice(0, 3)}...${lastFour(publicKeyInput)}`}
</h2>

{#if solBalance !== null}
    <p>Balance: {`(${solBalance.toFixed(6)} SOL)`}</p>
{/if}

{#if error}
    <p class="error">{error}</p>
{/if}

<br />

{#each transactions as tx (tx.signature)}
    <div class="transaction-wrapper">
        <div class="transaction-content">
            <div>From: ...{lastFour(tx.from)}</div>
            <div>To: ...{lastFour(tx.to)}</div>
            <div>Amount (SOL): {tx.amount}</div>
            <div>Time: {tx.blockTime}</div>
        </div>
    </div>
{/each}

<style>
    h2 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #00ffff;
    }

    p {
        color: #00ffff;
    }

    .error {
        color: red;
        font-weight: bold;
        margin-top: 1rem;
    }

    .transaction-wrapper {
        position: relative;
        border-radius: 12px;
        margin-top: 1rem;
        overflow: visible;
    }

    .transaction-wrapper::before {
        content: "";
        position: absolute;
        inset: -10px;
        background: #00ffff;
        filter: blur(18px);
        opacity: 0.55;
        border-radius: 14px;
        z-index: 0;
        animation: pulse 4s ease-in-out infinite;
        transition: opacity 0.25s ease;
    }

    .transaction-wrapper:hover::before {
        opacity: 0.9;
    }

    .transaction-content {
        position: relative;
        z-index: 1;
        background: #06001a;
        padding: 1rem;
        text-align: left;
        border-radius: 12px;
        border: 1px solid rgba(0, 255, 255, 0.6);
        color: #00ffff;
        display: flex;
        opacity: 1;
        flex-direction: column;
        gap: 0.5rem;
    }

    @keyframes pulse {
        0% {
            opacity: 0.4;
        }
        50% {
            opacity: 0.9;
        }
        100% {
            opacity: 0.4;
        }
    }
</style>
