<script>
    // @ts-nocheck

    import { push } from "svelte-spa-router";
    import { BROWSERSDK } from "../tools/authorization";
    import GlowingButton from "../lib/CustomButtom.svelte";
    import GitButton from "../lib/GitButton.svelte";
    import GlowingToken from "../lib/GlowingToken.svelte";
    import { Bird } from "lucide-svelte"

    const connectWallet = async () => {
        try {
            const addresses = await BROWSERSDK.connect({ provider: "google" });

            console.log("Connected addresses:", addresses);
            push("/home");
        } catch {
            console.log("error signing in");
        }
    };
</script>

<GlowingToken size={200} IconComponent={Bird} label="TOKEN DOVE" />
<br />
<br />
<br />
<div class="app-footer">
        We provide a simple, open-source platform for in-game asset exchange.
</div>
<br/>
<GlowingButton
    text="Sign In with Phantom"
    onClick={connectWallet}
    showIcon={true}
/>
<br />
<br />
<GitButton />

<style>
   

    .app-footer {
        padding: 12px 0;
        font-size: 0.85rem;
        color: #00ffff;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

</style>
