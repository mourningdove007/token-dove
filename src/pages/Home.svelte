<script>
    import { push } from "svelte-spa-router";

    const goToLedger = async () => {
        await push("/ledger");
    };
</script>

<button class="signOutButton">Sign Out</button>

<h2>Welcome</h2>
<p>To view transaction history, please select from our avialable options below.</p>


<button onclick={goToLedger}>View Your Solana Devnet Transaction History</button
>

<div class="footer">
    <a href="https://github.com/mourningdove007/token-dove" target="_blank"
        >Token Dove</a
    > • Devnet Edition • Printed from the Solana blockchain
</div>

<style>
    .footer {
        text-align: center;
        font-size: 0.8rem;
        margin-top: 3rem;
    }

    .signOutButton {
        display: flex;
        flex-direction: column;
        padding: 0.6rem;
        font-size: 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    h2 {
        text-align: center;
        margin-bottom: 1.5rem;
    }
    button {
        padding: 0.6rem;
        font-size: 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
</style>
