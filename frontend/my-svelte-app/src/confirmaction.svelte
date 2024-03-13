<script>
    import { createEventDispatcher } from "svelte";
    export let show = false;
    const dispatch = createEventDispatcher()
</script>

<main>
    {#if show}
         <slot></slot>
         <div class="controls">
            <button on:click={()=>dispatch("close")}>Close</button>
            <button on:click={()=>dispatch("confirm")} class="alert">Yes</button>
         </div>
    {/if}
</main>
<style>
    main{
        font-size:13px;
        margin-top:12px;
    }
</style>