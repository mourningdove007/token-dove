<script lang="ts">
    import { Ghost } from "lucide-svelte";
    import GlowingToken from "../lib/GlowingToken.svelte";
    import { createMintButtonHandler } from "../tools/callsToChain";

</script>

<GlowingToken size={200} IconComponent={Ghost} label={"Coming Soon"}/>

<button onclick={createMintButtonHandler}>Create</button>

