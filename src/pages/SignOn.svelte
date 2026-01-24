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

<button onclick={connectWallet}>Sign In</button>

<div class="footer">
    <a href="https://github.com/mourningdove007/token-dove" target="_blank"
        >Token Dove</a
    > • Devnet Edition • Printed from the Solana blockchain
</div>

<style>
    button {
        padding: 0.6rem;
        font-size: 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
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
