<script>
    import { push } from "svelte-spa-router";
    import { BROWSERSDK } from "../tools/universal";

    const signOut = async () => {
        await BROWSERSDK.disconnect();

        push("/");
    };

    const goToLedger = async () => {
        await push("/ledger");
    };
</script>

<button class="signOutButton" onclick={signOut}>Sign Out</button>

<h2>Welcome</h2>
<p>
    To view transaction history, please select from our avialable options below.
</p>

<button onclick={goToLedger}>View Your Solana Devnet Transaction History</button
>

<style>
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
