<script>
    import { createEventDispatcher } from "svelte";
    import Picmo from "../Picmo/picmo.svelte";
    let showPicmo = false;

    const dispatch = createEventDispatcher();

    const handleEmojiselect = (e) => {
        console.log(e.detail);
        showPicmo = false;
        dispatch("emojiselect", e.detail);
    };
</script>

<main>
    <button
        class="emojibtn"
        on:click={() => {
            showPicmo = !showPicmo;
        }}
    >
        {#if showPicmo}
            x
        {:else}
            ☺​
        {/if}
    </button>
    {#if showPicmo}
        <Picmo on:emojiselect={handleEmojiselect} />
    {/if}
</main>

<style>
    main {
        position: absolute;
        right: 5px;
        top: 5px;
    }

    .emojibtn {
        position: absolute;
        right: 0px;
        top: 0px;
        padding: 0 10px;
        border-radius: 0px 3px 0px 10px;
    }
</style>
