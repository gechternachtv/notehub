<script>
    // @ts-nocheck

    import { onDestroy, onMount } from "svelte";
    import Sortable from "sortablejs";
    import { createEventDispatcher } from "svelte";

    export let options = {};

    let sortableElement, sortableObj;

    const dispatch = createEventDispatcher();

    const defaults = {
        scroll: true,
        forceAutoScrollFallback: true,
        forceFallback: false,

        scrollSensitivity: 70,
        bubbleScroll: true,
        direction: "vertical",
        group: {
            name: "cards",
        },
        handle: ".grabber",
        animation: 0,
        swapThreshold: 0.3,
        multiDrag: false,
        selectedClass: "selected",
        delay: 300, // time in milliseconds to define when the sorting should start
        delayOnTouchOnly: true,
        ghostClass: "sortable-ghost",
        chosenClass: "sortable-chosen", // Class name for the chosen item
        dragClass: "sortable-drag",
        onStart: (e) => {
            //console.log(e.item);
            // e.item.draggable = false
            document
                .querySelector("body")
                .classList.add("elementisbeingdragged");
        },
        onEnd: (e) => {
            document
                .querySelector("body")
                .classList.remove("elementisbeingdragged");
        },
        onUpdate: (e) => {
            const tochildren = Array.prototype.slice
                .call(e.target.children)
                .map((e) => e.id);
            //console.log("updated!");
            dispatch("change", {
                tochildren: tochildren,
                type: "update",
                item: e.item,
            });
        },
        onAdd: (e) => {
            // console.log(e)
            const tochildren = Array.prototype.slice
                .call(e.target.children)
                .map((e) => e.id);
            // console.log("im the added one")
            // console.log(fromchildren,tochildren)

            dispatch("change", {
                tochildren: tochildren,
                type: "add",
                item: e.item,
            });
        },
        onRemove: (e) => {
            // same properties as onEnd
            // console.log(e)
            const tochildren = Array.prototype.slice
                .call(e.target.children)
                .map((e) => e.id);
            // console.log("im the removed one")
            // console.log(fromchildren,tochildren)

            dispatch("change", {
                tochildren: tochildren,
                type: "remove",
                item: e.item,
            });
        },
        ...options,
    };

    onMount(() => {
        sortableObj = new Sortable(sortableElement, defaults);

        // console.log(sortableObj);
    });

    onDestroy(() => {
        sortableObj.destroy();
    });
</script>

<main>
    <div
        class={$$restProps.class || "sortableElement"}
        bind:this={sortableElement}
    >
        <slot />
    </div>
</main>
