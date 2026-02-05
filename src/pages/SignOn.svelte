<script>
    // @ts-nocheck

    import { push } from "svelte-spa-router";
    import { BROWSERSDK } from "../tools/universal";
    import GlowingButton from "../lib/CustomButtom.svelte";
    import GlowingToken from "../lib/GlowingToken.svelte";

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

<GlowingToken size={200} />
<br />
<br />
<br />
<GlowingButton
    text="Sign In with Phantom"
    onClick={connectWallet}
    showIcon={true}
/>
<br />
<br />
<footer class="app-footer">
    <small>
        <a
            href="https://github.com/mourningdove007/token-dove"
            target="_blank"
            rel="noopener noreferrer"
        >
            Token Dove is open source
        </a>
        — a simple platform for in-game asset exchange.
    </small>
</footer>

<style>
    p {
        max-width: 500px;
        text-align: left;
    }

    .app-footer {
        text-align: center;
        padding: 12px 0;
        font-size: 0.85rem;
        color: #aaaaaa;
    }

    .app-footer a {
        color: #00ffff;
        text-decoration: none;
        font-weight: 500;
    }

    .app-footer a:hover {
        text-decoration: underline;
    }

    html,
    body {
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
    }
</style>
