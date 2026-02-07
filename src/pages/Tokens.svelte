<script>
    import { push } from "svelte-spa-router";
    import GlowingToken from "../lib/GlowingToken.svelte";
    import { Shield, Flame, Droplet, Gem, Amphora, Sword } from "lucide-svelte";
    import CustomButtom from "../lib/CustomButtom.svelte";

    export let tokens = [
        { icon: Sword, label: "SWORD", coinColor: "#ffd700" },
        { icon: Shield, label: "SHIELD", coinColor: "#4927F5" },
        { icon: Flame, label: "FIRE", coinColor: "#F56F27" },
        { icon: Droplet, label: "WATER", coinColor: "#279FF5" },
        { icon: Gem, label: "DIAMOND", coinColor: "white" },
        { icon: Amphora, label: "POTION", coinColor: "#6CF527" },
    ];

    let currentIndex = 0;

    const backHome = async () => {
        await push("/home");
    };

    function prev() {
        currentIndex = (currentIndex - 1 + tokens.length) % tokens.length;
    }

    function next() {
        currentIndex = (currentIndex + 1) % tokens.length;
    }
</script>

<div class="button2">
    <CustomButtom text="Home" onClick={backHome} showIcon={false} />
</div>

<br />
<br />
<br />

<div class="carousel-container">
    <div class="token-display">
        <GlowingToken
            IconComponent={tokens[currentIndex].icon}
            label={tokens[currentIndex].label}
            coinColor={tokens[currentIndex].coinColor}
            size={200}
        />
    </div>

    <br />
    <br />

    <div class="navigation-bar">
        <button class="nav prev" on:click={prev}>&lt;</button>
        <button class="nav next" on:click={next}>&gt;</button>
    </div>
</div>

<style>
    .navigation-bar {
        align-items: center;
        justify-content: center;
        text-align: center;

        display: flex;
        flex-direction: row;
        gap: 50px;
    }

    .carousel-container {
        align-items: center;
        justify-content: center;
    }

    .token-display {
        width: 150px;
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .nav {
        background: rgba(0, 0, 0, 0.6);
        border: 1px solid white;
        color: white;
        padding: 0.5rem 1rem;
        font-size: 1.2rem;
        border-radius: 8px;
        cursor: pointer;
        user-select: none;
        transition: all 0.2s ease;
    }

    .nav:hover {
        background: rgba(0, 0, 0, 0.9);
        transform: scale(1.05);
    }

    @media (prefers-reduced-motion: reduce) {
        .nav {
            transition: none;
        }
    }
</style>
