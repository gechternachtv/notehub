<script>
    // @ts-nocheck

    import { pb } from "./pb";
    import { push } from "svelte-spa-router";
    import Boardcard from "./Allboards/boardcard.svelte";
    import Confirmaction from "./confirmaction.svelte";
    import { createEventDispatcher } from "svelte";
    import { server } from "./stores";
    // import {localToken} from '../stores.js'

    export let isopen = true;
    const dispatch = createEventDispatcher();

    export let single = true;
    export let usergroup = null;
    export let currentBoards = [];

    let showconfirmbox = false;
    let checkboxholder;
    let boardlist = [];
    let hasboards = false;
    let searchWord = "";

    const getallBoards = async () => {
        return await pb.collection("boards").getFullList({
            fields: "color,name,id,img,collectionId",
            filter: `${usergroup ? `usergroup = "${usergroup}"` : ""}`,
        });
    };
    let promise;
    $: {
        if (isopen) {
            promise = getallBoards();
        }
    }

    function inputchange(e) {
        if (!single) {
            if (e.target.checked) {
                boardlist.push(e.target.id);

                hasboards = boardlist.length > 0;
                console.log(boardlist, hasboards);
            } else {
                boardlist = boardlist.filter((a) => a != e.target.id);

                hasboards = boardlist.length > 0;
                console.log(boardlist, hasboards);
            }
        } else {
            hasboards = true;
            boardlist = [e.target.id];
        }
    }

    function handleSend() {
        if (hasboards) {
            dispatch("submit", boardlist);
            isopen = false;
        }
    }

    function handleInputSearch(e) {
        console.log(e.target.value);

        searchWord = e.target.value;
    }
</script>

<main>
    <div class="checkbox-holder">
        {#if isopen}
            {#await promise then boards}
                <input
                    placeholder="search"
                    type="text"
                    on:input={handleInputSearch}
                />

                {#each boards.filter( (e) => e.name.includes(searchWord), ) as board}
                    <div class="checkbox">
                        <input
                            class="boardselector"
                            type={single ? "radio" : "checkbox"}
                            id={board.id}
                            name="boards"
                            on:change={inputchange}
                        />
                        <label for={board.id}>
                            <div class="boardcontainer">
                                <Boardcard workspacecard={true} {board} />
                            </div>
                        </label>
                    </div>
                {/each}
            {/await}
        {/if}
    </div>
    {#if hasboards}
        <button on:click={handleSend}>send!</button>
    {/if}
</main>

<style>
    label {
        cursor: pointer;
    }
    .checkbox {
        display: flex;
        gap: 15px;
    }
    .boardcontainer {
        pointer-events: none;
    }
    main {
        background: var(--card-bg);
        padding: 30px;
        color: var(--button-bg);
        box-sizing: border-box;
        position: relative;
    }

    button {
        min-width: 120px;
        background: var(--button-bg);
        color: var(--button-color);
        padding: 5px;
        font-weight: bold;
        font-size: 1.2rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 5px;
        border: 0px;
        margin: 20px 0;
        cursor: pointer;
        text-align: center;
        justify-content: center;
        max-width: 190px;
    }
</style>
