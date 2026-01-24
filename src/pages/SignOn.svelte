<script>
    import { BROWSERSDK } from "../tools/universal";

    const connectWallet = async () => {
        try {
            const addresses = await BROWSERSDK.connect({ provider: "google" });
            console.log("Connected addresses:", addresses);
        } catch {
            console.log("error signing in");
        }
    };
</script>

<h2>Token Dove</h2>
<p>This is an <a href="https://github.com/mourningdove007/token-dove">open source project</a> with the end goal of providing videogame developers an easy platform for in game asset exchange. Currently, the app will allow a user to sign in with their Phantom wallet and view transaction history.</p>
<button onclick={connectWallet}>
    <img src="src/assets/phantom.ico" alt="Phantom" class="logo" />
    <span>Continue with Phantom</span>
</button>
<p>Privacy Disclaimer: No personal information is collected as there is no backend. All information is owned by the user.</p>


<div class="footer">
    <a href="https://github.com/mourningdove007/token-dove" target="_blank"
        >Token Dove</a
    > • Devnet Edition • Printed from the Solana blockchain
</div>

<style>
    button {
        border-width: 2px;
        border-color: rgb(171, 159, 242);;
        gap: 0.5rem;
        display: inline-flex;
        align-items: center;
        line-height: 1;
        padding: 0.6rem;
        font-size: 1rem;
        border-radius: 4px;
        cursor: pointer;
    }

    p {
        width: 500px;
    }

    .footer {
        text-align: center;
        font-size: 0.8rem;
        margin-top: 3rem;
    }

    .footer a:hover {
        text-decoration: underline;
    }
</style>
