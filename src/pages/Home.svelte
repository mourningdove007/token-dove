<script>
    // @ts-nocheck

    import { push } from "svelte-spa-router";
    import { BROWSERSDK } from "../tools/universal";
    import GlowingButton from "../lib/CustomButtom.svelte";
    import GlowingToken from "../lib/GlowingToken.svelte";
    import { Bird } from "lucide-svelte";

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

<GlowingToken size={200} IconComponent={Bird} label="WELCOME BACK" />
<br />
<br />
<GlowingButton
    text="(Devnet) Solana Transaction History"
    onClick={goToLedger}
    showIcon={false}
/>
<br />
<br />
<div style="display: flex; flex-direction:row;">
    <GlowingButton text="My Tokens" onClick={goToMyCoins} showIcon={false} />
    <span style="margin-left:auto">
        <GlowingButton
            text="Log Out"
            onClick={signOut}
            showIcon={false}
            buttonColor="red"
        />
    </span>
</div>

<style>
</style>
