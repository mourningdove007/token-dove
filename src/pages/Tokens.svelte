<script>
    import { push } from "svelte-spa-router";
    import GlowingToken from "../lib/GlowingToken.svelte";
    import { Shield, Flame, Droplet, Gem, Amphora, Sword } from "lucide-svelte";
    import CustomButtom from "../lib/CustomButtom.svelte";

    export let tokens = [
        {
            icon: Sword,
            label: "SWORD",
            coinColor: "#ffd700",
            iconName: "Sword",
        },
        {
            icon: Shield,
            label: "SHIELD",
            coinColor: "#4927F5",
            iconName: "Shield",
        },
        { icon: Flame, label: "FIRE", coinColor: "#F56F27", iconName: "Flame" },
        {
            icon: Droplet,
            label: "WATER",
            coinColor: "#279FF5",
            iconName: "Droplet",
        },
        { icon: Gem, label: "DIAMOND", coinColor: "white", iconName: "Gem" },
        {
            icon: Amphora,
            label: "POTION",
            coinColor: "#6CF527",
            iconName: "Amphora",
        },
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

<div class="carousel-container">
    <div>
        <GlowingToken
            IconComponent={tokens[currentIndex].icon}
            label={tokens[currentIndex].label}
            coinColor={tokens[currentIndex].coinColor}
            size={200}
        />
    </div>
    <div
        class="transaction-wrapper"
        style={`background: ${tokens[currentIndex].coinColor}`}
    >
        <div
            class="transaction-content"
            style={`color: ${tokens[currentIndex].coinColor}; border-color: ${tokens[currentIndex].coinColor}`}
        >
            <div>{`Label: ${tokens[currentIndex].label}`}</div>
            <div style="display: flex; flex-direction: row">
                <div>{`Icon: `}</div>
                <svelte:component
                    this={tokens[currentIndex].icon}
                    x="150"
                    y="110"
                    color={tokens[currentIndex].coinColor}
                />
            </div>
            <div>{`Color: ${tokens[currentIndex].coinColor}`}</div>
        </div>
    </div>
    <br />
    <div class="bottom">
        <button class="nav prev" on:click={prev}>&lt;</button>

        <CustomButtom
            text="Home"
            onClick={backHome}
            showIcon={false}
            buttonColor={"#ffffff"}
        />

        <button class="nav next" on:click={next}>&gt;</button>
    </div>
</div>

<style>
    .bottom {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .carousel-container {
        align-items: center;
        justify-content: center;
    }

    .nav {
        background: rgba(0, 0, 0, 0.6);
        border: 1px solid white;
        color: white;
        padding: 0.5rem 1rem;
        font-size: 2.8rem;
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
    .transaction-wrapper {
        position: relative;
        border-radius: 12px;
        margin-top: 1rem;
        overflow: visible;
    }

    .transaction-content {
        position: relative;
        z-index: 1;
        background: #06001a;
        padding: 1rem;
        text-align: left;
        border-radius: 12px;
        border: 1px solid;
        display: flex;
        opacity: 1;
        flex-direction: column;
        font-size: small;
        gap: 0.5rem;
    }

    @keyframes pulse {
        0% {
            opacity: 0.4;
        }
        50% {
            opacity: 0.9;
        }
        100% {
            opacity: 0.4;
        }
    }
</style>
