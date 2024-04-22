<script>
    // @ts-nocheck

    import Card from "../Card/card.svelte";
    import { pb } from "../pb.js";

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
    let searchtag = "";

    async function handleDndFinalize(e) {
        console.log("%c drop details: <<<<<<-----", "color:teal");
        console.log(counter, cards);
        console.log(board.name);
        console.log("%c  ----->>>>>", "color:red");
        console.log(e.detail.tochildren);
        // dragDisabled = true
    }

    //

    async function getRecords() {
        try {
            // let params = new URLSearchParams(document.location.search);
            // let text = params.get("text"); // is the string "Jonathan"
            // console.log(text);

            const resultList = await pb.collection("cards").getList(1, 60, {
                filter: `(text ~ "${textsearch}" || title ~ "${textsearch}" || link ~ "${textsearch}" || tags.name ~ "${textsearch}" || file ~ "${textsearch}") ${needslink ? `&& link != ""` : ""} ${needsimg ? `&& (imglink != "" || file ~ "jpg" || file ~ "png" || file ~ "gif" || file ~ "webp")` : ""} ${needsfile ? `&& file != ""` : ""} ${searchtag != "" ? `&& tags.name ~ "${searchtag}"` : ""}`,
                sort: "-created",
                expand: "tags",
            });
            console.log(resultList);

            return resultList;
        } catch (error) {
            console.warn(error);
        }
    }

    let promise;

    const getTags = async () => {
        // fetch a paginated records list
        const records = await pb.collection("tags").getFullList({
            sort: "-created",
        });

        return records;
    };

    const promisetags = getTags();

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
</script>

<main>
    <!-- content here -->

    {#await promisetags}
        <!-- promise is pending -->
    {:then tags}
        <div class="tags">
            {#each tags as tag}
                <button
                    on:click={() => {
                        textsearch = "";
                        searchtag = tag.name;
                        promise = getRecords();
                    }}
                    class="tag tag-{tag.id}"
                    style="background:{tag.color};">{tag.name}</button
                >
            {/each}
        </div>
    {:catch error}
        <!-- promise was rejected -->
    {/await}
    <div>
        <input type="checkbox" name="haslink" bind:checked={needslink} /> has link
    </div>
    <div>
        <input type="checkbox" name="hasimage" bind:checked={needsimg} /> has image
    </div>
    <div>
        <input type="checkbox" name="hasfile" bind:checked={needsfile} /> has file
    </div>
    <input type="text" bind:value={textsearch} />
    <button
        on:click={() => {
            searchtag = "";
            promise = getRecords();
        }}>search</button
    >

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

                    <Sortgrid
                        class="card-grid {listView ? 'list' : ''}"
                        on:change={handleDndFinalize}
                    >
                        {#each searchresult.items as card (card.id)}
                            <Card {listView} {card}></Card>
                        {/each}
                    </Sortgrid>
                </div>
            </div>
        {/if}
    {:catch error}
        {error}
    {/await}
</main>

<style>
    main {
        position: relative;
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
        font-size: 1.1rem;
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
</style>
