<script>
    import { createEventDispatcher } from "svelte";
    import Picmo from "./picmo.svelte";

    export let allowcuston = false;
    let showPicmo = false;

    const dispatch = createEventDispatcher();

    const handleEmojiselect = (e) => {
        showPicmo = false;
        dispatch("emojiselect", e.detail);
    };
</script>

<main>
    <button
        class="picmobutton"
        on:click={() => {
            showPicmo = !showPicmo;
        }}
    >
        {#if showPicmo}
            ❌️
        {:else}
            <img src="https://2img.net/u/2615/11/13/86/smiles/2213793032.gif" />
        {/if}
    </button>
    {#if showPicmo}
        <Picmo {allowcuston} on:emojiselect={handleEmojiselect} />
    {/if}
</main>

<style>
    main {
        position: relative;
    }
</style>
