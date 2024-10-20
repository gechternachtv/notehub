<script>
    import { createEventDispatcher } from "svelte";
    export let show = false;
    const dispatch = createEventDispatcher();
</script>

<main>
    {#if show}
        <div class="main">
            <slot />
            <div class="controls">
                <button on:click={() => dispatch("close")}>Close</button>
                <button on:click={() => dispatch("confirm")} class="alert"
                    >Yes</button
                >
            </div>
        </div>
    {/if}
</main>

<style>
    .main {
        font-size: 1.2rem;
        margin-top: 12px;
    }
</style>
