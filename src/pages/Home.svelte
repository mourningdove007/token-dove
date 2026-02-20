<script>
    // @ts-nocheck

    import { signOut, goToLedger } from "../tools/navigation";
    import GlowingButton from "../lib/CustomButtom.svelte";
    import GlowingToken from "../lib/GlowingToken.svelte";
    import { Bird } from "lucide-svelte";
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
<GlowingButton
    text="Log Out"
    onClick={signOut}
    showIcon={false}
    buttonColor="red"
/>

<style>
</style>
