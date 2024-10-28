<script>
    // @ts-nocheck

    import Card from "../Card/card.svelte";
    import { pb } from "../pb.js";
    import Calendarselector from "./calendarselector.svelte";
    import { onMount } from "svelte";
    import { localToken } from "../stores.js";

    //flip

    // import {dndzone} from "svelte-dnd-action";
    import Sortgrid from "../Boardpage/sortcardsgrid.svelte";

    export let listView = undefined;

    // console.log("%c =-=====", "font-size:30px;color:teal");
    // console.log(board);

    //flip

    let textsearch = "";
    let needslink = false;
    let needsimg = false;
    let needsfile = false;
    let searchtags = [];
    let includeraw = false;
    let sortby = "newest";
    // let searchtag = "";
    let filter = `(board.usergroup.users ~ "${$localToken.model.id}" || board.usergroup.public = "global-view")`;

    $: {
        console.log(filter);
    }

    //

    async function getRecords() {
        try {
            const resultList = await pb.collection("cards").getList(1, 60, {
                filter: filter,
                sort: `${sortby === "oldest" ? "" : "-"}created`,
                expand: "tags",
            });
            console.log(resultList);

            return resultList;
        } catch (error) {
            console.warn(error);
        }
    }

    let promise;

    if (listView === undefined) {
        listView = !!window.localStorage.getItem("listView");
    }
    const handleListViewChange = () => {
        if (!window.localStorage.getItem("listView")) {
            window.localStorage.setItem("listView", true);
            listView = true;
        } else {
            window.localStorage.removeItem("listView");
            listView = false;
        }
    };

    const handledayclick = (e) => {
        console.log(e.detail);
        filter = `((created >= "${e.detail.year}-${e.detail.month}-${e.detail.day} 00:00:00" && created <= "${e.detail.year}-${e.detail.month}-${e.detail.day} 23:59:59") || title ~ "${e.detail.day}-${e.detail.month}-${e.detail.year}") && (board.usergroup.users ~ "${$localToken.model.id}" || board.usergroup.public = "global-view")`;
        promise = getRecords();
    };
</script>

<main>
    <div class="calendar-wrapper">
        <Calendarselector on:dayclick={handledayclick}></Calendarselector>
    </div>
    <div class="calendar-result">
        {#await promise}
            . . .
        {:then searchresult}
            {#if searchresult}
                <div class="locked container">
                    <!-- {board.id} -->

                    <div class="grid-container">
                        <!-- <div class="grid"
                class:list={listView} use:dndzone={{items:cards,
                morphDisabled:true,
                dragDisabled:false,
                type:"cards",
                dropTargetStyle:{opacity:"0.6"}
                ,dropTargetClasses:["floating"]
                }
                } on:consider="{handleDndConsider}" on:finalize="{handleDndFinalize}"> -->

                        <Sortgrid class="card-grid list">
                            {#each searchresult.items as card (card.id)}
                                <Card listView="true" {card}></Card>
                            {/each}
                        </Sortgrid>
                    </div>
                </div>
            {/if}
        {:catch error}
            {error}
        {/await}
    </div>
</main>

<style>
    .calendar-result {
        width: 100%;
    }
    .calendar-wrapper {
        min-width: 300px;
    }
    main {
        position: relative;
        display: flex;
        gap: 30px;
    }

    @media (max-width: 991px) {
        .calendar-wrapper {
            min-width: 100%;
        }
        main {
            display: grid;
        }
    }
    .con {
        display: grid;
        grid-template-columns: 1fr;
    }

    .card-placeholder {
        display: block;
        background: rgba(0, 0, 0, 0.021);
        min-height: 110px;
        width: 100%;
        pointer-events: none;
        grid-column: span 3;
    }
    main {
        background: var(--container-bg);
        color: var(--main-font-1);
        margin: auto;
        /* max-width: var(--container); */
        width: 100%;
        /* padding-bottom: 20px; */
    }

    .grid-container {
        max-height: var(--board-height);
        overflow: scroll;
    }

    .container {
        padding: 0px;
        container-type: inline-size;
        container-name: card-container;
    }

    .con {
        position: sticky;
        width: 100%;
        bottom: 0;
        border-top: 4px solid var(--container-bg);
    }
    .editorOpentoggle {
        position: absolute;
        top: 18px;
        right: 20px;
        padding: 6px 8px;
        border-radius: 6px;
    }

    @media (max-width: 991px) {
        .listviewtoggle {
            display: none;
        }
    }

    .tags {
        font-size: 1.2rem;
        opacity: 0.8;
        margin-bottom: 20px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .tags button {
        background: var(--header-bg);
        color: white;
    }
    .tag {
        opacity: 0.6;
    }
    .tag.active {
        opacity: 1;
    }
    .tag.active:before {
        content: "☑️";
        display: inline;
    }

    .search-container {
        display: flex;
        gap: 10px;
        align-content: center;
        align-items: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .flex {
        display: flex;
        align-content: center;
        align-items: center;
        gap: 10px;
    }

    main {
        background: var(--card-bg);
        padding: min(30px, 2vw);
        border-radius: 10px;
    }
</style>
