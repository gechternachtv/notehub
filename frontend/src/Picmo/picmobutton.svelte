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
        on:click={() => {
            showPicmo = !showPicmo;
        }}
    >
        {#if showPicmo}
            x
        {:else}
            🐸​
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
