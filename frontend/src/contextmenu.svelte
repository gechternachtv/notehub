<script>
    import { onMount, onDestroy } from "svelte";

    let foo;
    onMount(() => {
        document.querySelector("nav").prepend(foo);
    });
    onDestroy(() => {
        foo.remove();
    });
</script>

<div bind:this={foo} class="absolute controls">
    <slot>notehub</slot>
</div>

<style>
    .absolute {
        position: absolute;

        background: var(--header-bg);
        padding: 5px;
        left: 0px;
        align-content: center;
        justify-content: center;
        align-items: center;

        font-weight: bold;

        color: var(--header-color);
        top: 29px;
        border-radius: 0 0px 14px 0px;
        padding-left: 20px;
        font-size: 2.1rem;
        gap: 9px;

        font-weight: normal;
        font-size: 1.2rem;
    }

    @media (min-width: 991px) {
        .absolute {
            padding: 6px 7px;
            padding-left: 20px;
            top: 20px;
            font-size: 1.2rem;
            z-index: 3;
        }
    }
</style>
