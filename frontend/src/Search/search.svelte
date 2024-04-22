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
    let searchtags = [];
    let includeraw = false;
    let sortby = "newest";
    // let searchtag = "";

    $: {
        console.log(
            `${searchtags.length > 0 ? `(${searchtags.map((e, i) => `tags.name ?~ "${e}" ${i === searchtags.length - 1 ? "" : "||"}`).join(" ")}) &&` : ``} (text ~ "${textsearch}" || title ~ "${textsearch}" || link ~ "${textsearch}" || file ~ "${textsearch}") ${needslink ? `&& link != ""` : ""} ${needsimg ? `&& (imglink != "" || file ~ "jpg" || file ~ "png" || file ~ "gif" || file ~ "webp")` : ""} ${needsfile ? `&& file != ""` : ""}`,
        );
    }

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
                filter: `${searchtags.length > 0 ? `(${searchtags.map((e, i) => `tags.name ?~ "${e}" ${i === searchtags.length - 1 ? "" : "||"}`).join(" ")}) &&` : ``} (${includeraw ? `raw ?~ "${textsearch}" || ` : ""}text ~ "${textsearch}" || title ~ "${textsearch}" || link ~ "${textsearch}" || file ~ "${textsearch}") ${needslink ? `&& link != ""` : ""} ${needsimg ? `&& (imglink != "" || file ~ "jpg" || file ~ "png" || file ~ "gif" || file ~ "webp")` : ""} ${needsfile ? `&& file != ""` : ""}`,
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
                    class:active={searchtags.includes(tag.name)}
                    on:click={() => {
                        if (searchtags.includes(tag.name)) {
                            searchtags = searchtags.filter(
                                (e) => e != tag.name,
                            );
                            console.log(searchtags);
                        } else {
                            searchtags = [...searchtags, tag.name];
                            console.log(searchtags);
                        }

                        // promise = getRecords();
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
    <div>
        <input type="checkbox" name="innertext" bind:checked={includeraw} /> search
        inner text (may bring innacurate results)
    </div>
    <div class="flex">
        sort by: <button
            on:click={() => {
                sortby = sortby === "oldest" ? "newest" : "oldest";
            }}>{sortby}</button
        >
    </div>

    <div class="search-container">
        <input type="text" bind:value={textsearch} />
        <button
            on:click={() => {
                promise = getRecords();
            }}>search</button
        >
    </div>

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
</style>
