<script>
    import { onMount } from "svelte";
    import { createEventDispatcher } from "svelte";
    import { createPicker } from "picmo";

    let picmoEl;
    const dispatch = createEventDispatcher();

    onMount(() => {
        if (picmoEl) {
            const picker = createPicker({ rootElement: picmoEl });
            picker.addEventListener("emoji:select", (event) => {
                dispatch("emojiselect", { emoji: event.emoji });
            });
        }
    });
</script>

<div class="picmo" bind:this={picmoEl}></div>

<style>
    .picmo {
        position: absolute;
        z-index: 99;
    }
</style>
