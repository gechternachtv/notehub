<script>
    // @ts-nocheck

    import Boardcard from "../Allboards/boardcard.svelte";
    import { pb } from "../pb";
    import { createEventDispatcher } from "svelte";
    export let currentboard;
    export let isopen = false;
    export let usergroup;
    import { onMount } from "svelte";

    const getAllBoards = async () => {
        console.log("got all boards!");
        console.log(usergroup);
        return await pb.collection("boards").getFullList({
            sort: "-created",
            expand: "usergroup",
            fields: "id,name,color,img,collectionId,expand.usergroup.name,expand.usergroup.id,usergroup",
            filter: `usergroup = "${usergroup}"`,
        });
    };

    const dispatch = createEventDispatcher();
    let checkboxholder;
    let promise;

    $: {
        if (isopen) {
            promise = getAllBoards();
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const id = document.querySelector(
            `input[name="boards"]:checked`,
        )?.value;
        if (id) {
            dispatch("submit", currentboard);
        }
    };
</script>

<main>
    <div bind:this={checkboxholder} class="checkbox-holder">
        {#if isopen}
            {#await promise}
                loading boards...
            {:then boards}
                <h1 class="title">Move card to:</h1>
                <form on:submit={handleSubmit}>
                    {#each boards as board}
                        <div class="checkbox">
                            <input
                                class=""
                                checked={board.id === currentboard.id}
                                type="radio"
                                id="checkbox-{board.id}"
                                name="boards"
                                value={board.id}
                                on:change={(e) => {
                                    console.log(e);
                                    if (e.target.checked) {
                                        console.log(board);
                                        currentboard = board;
                                    }
                                }}
                            />
                            <label for="checkbox-{board.id}">
                                <div class="boardcontainer">
                                    <Boardcard workspacecard={true} {board} />
                                </div>
                            </label>
                        </div>
                    {/each}
                    <button type="submit">move</button>
                </form>
            {:catch error}
                error catching boards: <br />
                {error}
            {/await}
        {/if}
    </div>
</main>

<style>
    .checkbox {
        display: flex;
        gap: 10px;
    }
    .boardcontainer {
        pointer-events: none;
    }
    label {
        cursor: pointer;
    }
    main {
        padding: 20px;
        background: var(--card-bg);
        color: var(--button-bg);
        box-sizing: border-box;
    }
    button {
        margin-top: 20px;
    }
</style>
