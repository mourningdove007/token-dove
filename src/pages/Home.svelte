<script>
    // @ts-nocheck

    import { push } from "svelte-spa-router";
    import { BROWSERSDK } from "../tools/universal";
    import GlowingButton from "../lib/CustomButtom.svelte";

    const signOut = async () => {
        await BROWSERSDK.disconnect();

        push("/");
    };

    const goToLedger = async () => {
        await push("/ledger");
    };

    const goToMyCoins = async () => {
        await push("/tokens");
    };
</script>

<div class="signOutButton">
    <GlowingButton text="Log Out" onClick={signOut} showIcon={false} />
</div>

<h2>Welcome</h2>
<p>
    To view transaction history, please select from our avialable options below.
</p>
<br />
<GlowingButton
    text="View Your Solana Devnet Transaction History"
    onClick={goToLedger}
    showIcon={false}
/>
<br />
<br />

<GlowingButton
    text="View Your Tokens (Not Connected)"
    onClick={goToMyCoins}
    showIcon={false}
/>

<style>
    .signOutButton {
        display: flex;
        flex-direction: column;
        padding: 0.6rem;
        max-width: 140px;
    }

    h2 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #00ffff;
    }

    p {
        color: #00ffff;
    }
</style>
