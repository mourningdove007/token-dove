<script>
    // @ts-nocheck

    import { push } from "svelte-spa-router";
    import { BROWSERSDK } from "../tools/universal";
    import GlowingButton from "../lib/GlowingButton.svelte";

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

<h2>Token Dove</h2>

<p>
    This is an <a href="https://github.com/mourningdove007/token-dove"
        >open source project</a
    >
    with the end goal of providing videogame developers an easy platform for in game
    asset exchange. Currently, the app will allow a user to sign in with their Phantom
    wallet and view transaction history.
</p>
<br />
<GlowingButton
    text="Sign In with Phantom"
    onClick={connectWallet}
    showIcon={true}
/>
<br />
<br />
<p>
    Privacy Disclaimer: No personal information is collected as there is no
    backend. All information is owned by the user.
</p>

<style>
    p {
        max-width: 500px;
        text-align: left;
    }
</style>
