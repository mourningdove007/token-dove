<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import { BROWSERSDK } from "../tools/universal";

    import {
        Connection,
        PublicKey,
        clusterApiUrl,
        LAMPORTS_PER_SOL,
    } from "@solana/web3.js";
    import { push } from "svelte-spa-router";
    import GlowingButton from "../lib/GlowingButton.svelte";

    let publicKeyInput = $state("");
    let transactions = $state([]);
    let error = "";

    const signOut = async () => {
        await BROWSERSDK.disconnect();

        push("/");
    };

    const backHome = async () => {
        await push("/home");
    };

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

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
                await fetchTransactions();
            }
        } catch (e) {
            error = "Failed to load public key";
            console.error(e);
        }
    });
</script>

<div class="actions">
    <div class="button1">
        <GlowingButton text="Sign Out" onClick={signOut} showIcon={false} />
    </div>
    <div class="button2">
        <GlowingButton text="Back Home" onClick={backHome} showIcon={false} />
    </div>
</div>

<h2>Transaction History</h2>

<p>{`Public Key: ${publicKeyInput}`}</p>

{#each transactions as tx (tx.signature)}
    <div class="transaction">
        <div>From: {tx.from}</div>
        <div>To: {tx.to}</div>
        <div>Amount (SOL): {tx.amount}</div>
        <div>
            Signature: <div>{tx.signature}</div>
        </div>
        <div>Time: {tx.blockTime}</div>
    </div>
{/each}

<style>
    h2 {
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .transaction {
        max-width: 500px;
        border-radius: 6px;
        padding: 0.8rem;
        margin-top: 1rem;
        word-break: break-all;
        text-align: left;
    }

    .actions {
        display: flex;
        gap: 0.75rem;
    }

    .button1 {
        margin: auto;
        padding: 0.6rem;
        font-size: 1rem;
    }

    .button2 {
        margin: auto;
        padding: 0.6rem;
        font-size: 1rem;
    }
</style>
