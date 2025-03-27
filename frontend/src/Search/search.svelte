<script>
    // @ts-nocheck

    import Card from "../Card/card.svelte";
    import { pb } from "../pb.js";
    import { localToken } from "../stores.js";
    import { querystring } from "svelte-spa-router";
    import { onMount } from "svelte";

    import LinkedList from "../linkedlist";
    //flip

    // import {dndzone} from "svelte-dnd-action";
    import Sortgrid from "../Boardpage/sortcardsgrid.svelte";
    import Tablecard from "../Card/tablecard.svelte";
    // export let listView = undefined;

    // console.log("%c =-=====", "font-size:30px;color:teal");
    // console.log(board);

    //flip

    let textsearch = "";
    let needslink = false;
    let needsimg = false;
    let needsfile = false;
    let searchtags = [];
    let includeraw = false;
    // let searchtag = "";
    let hasparam;
    let usergroupid = false;
    let tagsORAND = "&&";

    let isInProgress = false;
    let isComplete = false;

    let sortby = new LinkedList();
    sortby.append("newest");
    sortby.append("oldest");
    sortby = sortby.head;

    let checklistSearch = new LinkedList();
    checklistSearch.append("ignore");
    checklistSearch.append("in progress");
    checklistSearch.append("completed");
    checklistSearch = checklistSearch.head;

    $: {
        console.log(
            `(${searchtags.length > 0 ? `(${searchtags.map((e, i) => `tags ?~ "${e}" ${i === searchtags.length - 1 ? "" : `${tagsORAND}`}`).join(" ")}) &&` : ``} (${includeraw ? `raw ?~ "${textsearch}" || ` : ""}text ~ "${textsearch}" || title ~ "${textsearch}" || link ~ "${textsearch}" || file ~ "${textsearch}") ${needslink ? `&& link != ""` : ""} ${needsimg ? `&& (imglink != "" || file ~ "jpg" || file ~ "png" || file ~ "gif" || file ~ "webp")` : ""} ${needsfile ? `&& file != ""` : ""}) ${$localToken ? `&& board.usergroup.users ~ "${$localToken?.model?.id}" ${usergroupid ? ` && board.usergroup = "${usergroupid}"` : ""}` : ` && board.usergroup.public = "global-view" `}  ${isInProgress ? `&& done > 0 && done < 100` : isComplete ? `&& done = 100` : ``}`,
        );
    }

    const params = new URLSearchParams($querystring);
    if (params.get("tag") && params.get("usergroup")) {
        usergroupid = params.get("usergroup");
        searchtags.push(params.get("tag"));
        hasparam = true;
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

            const resultList = await pb.collection("cards").getList(1, 50, {
                filter: `(${searchtags.length > 0 ? `(${searchtags.map((e, i) => `tags ?~ "${e}" ${i === searchtags.length - 1 ? "" : `${tagsORAND}`}`).join(" ")}) &&` : ``} (${includeraw ? `raw ?~ "${textsearch}" || ` : ""}text ~ "${textsearch}" || title ~ "${textsearch}" || link ~ "${textsearch}" || file ~ "${textsearch}") ${needslink ? `&& link != ""` : ""} ${needsimg ? `&& (imglink != "" || file ~ "jpg" || file ~ "png" || file ~ "gif" || file ~ "webp")` : ""} ${needsfile ? `&& file != ""` : ""}) ${$localToken ? `&& board.usergroup.users ~ "${$localToken?.model?.id}" ${usergroupid ? ` && board.usergroup = "${usergroupid}"` : ""}` : ` && board.usergroup.public = "global-view" `}  ${isInProgress ? `&& done > 0 && done < 100` : isComplete ? `&& done = 100` : ``}`,
                sort: `${sortby.data === "oldest" ? "" : "-"}created`,
                expand: "tags,board.usergroup",
                fields: "collectionId,created,datementions,done,favico,file,id,imglink,link,text,title,expand.tags.name,expand.tags.id,expand.tags.color,expand.board.name,expand.board.id,expand.board.color,expand.board.expand.usergroup.id,expand.board.expand.usergroup.name",
            });
            console.log(resultList);

            return resultList;
        } catch (error) {
            console.warn(error);
        }
    }

    let promise;
    let parameterTag;
    let allTagsUsergroups;

    const getTags = async () => {
        // fetch a paginated records list
        const records = await pb.collection("tags").getFullList({
            sort: "-created",
            expand: "usergroup",
            fields: "name,color,id,expand.usergroup.id,expand.usergroup.name",
        });

        let allTagsUsergroupsMap = new Map();

        records.forEach((a) => {
            allTagsUsergroupsMap.set(
                a.expand.usergroup.id,
                a.expand.usergroup.name,
            );
        });

        allTagsUsergroups = Array.from(
            allTagsUsergroupsMap,
            ([name, value]) => ({ id: name, name: value }),
        );

        console.log(allTagsUsergroups);
        return records;
    };

    const promisetags = getTags();

    // if (listView === undefined) {
    //     listView = !!window.localStorage.getItem("listView");
    // }
    // const handleListViewChange = () => {
    //     if (!window.localStorage.getItem("listView")) {
    //         window.localStorage.setItem("listView", true);
    //         listView = true;
    //     } else {
    //         window.localStorage.removeItem("listView");
    //         listView = false;
    //     }
    // };

    onMount(() => {
        if (hasparam) {
            promise = getRecords();
        }
    });

    let showcard = {
        shortcut: true,
        id: true,
        img: true,
        title: true,
        text: true,
        usergroup: true,
        board: true,
        tags: true,
        created: true,
        targetdate: true,
        progress: true,
    };

    let currentview = new LinkedList();
    currentview.append("Card mode");
    currentview.append("Table mode");
    currentview = currentview.head;
</script>

<main>
    <!-- content here -->

    {#await promisetags}
        <!-- promise is pending -->
    {:then tags}
        {#each allTagsUsergroups as usergroup}
            <div class="usergroup-name">
                {usergroup.name}
            </div>
            <!-- content here -->
            <div class="tags">
                {#each tags.filter((a) => a.expand.usergroup.id === usergroup.id) as tag}
                    <button
                        class:active={searchtags.includes(tag.id) &&
                            usergroupid === tag.expand.usergroup.id}
                        on:click={() => {
                            if (searchtags.includes(tag.id)) {
                                searchtags = searchtags.filter(
                                    (e) => e != tag.id,
                                );
                            } else {
                                searchtags = [...searchtags, tag.id];
                            }

                            if (tag.expand.usergroup.id != usergroupid) {
                                usergroupid = tag.expand.usergroup.id;
                                searchtags = [tag.id];
                            }

                            // promise = getRecords();
                        }}
                        class="tag tag-{tag.id}"
                        style="background:{tag.color};">{tag.name}</button
                    >
                {/each}
            </div>
        {/each}
    {:catch error}
        <!-- promise was rejected -->
    {/await}
    <div class="flex">
        TAGS search mode:
        <button
            on:click={() => {
                tagsORAND = tagsORAND === "&&" ? "||" : "&&";
            }}>{tagsORAND === "&&" ? "AND" : "OR"}</button
        >
    </div>
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
        Checklist search: <button
            on:click={() => {
                checklistSearch = checklistSearch.next;

                if (checklistSearch.data === "in progress") {
                    isInProgress = true;
                    isComplete = false;
                } else if (checklistSearch.data == "completed") {
                    isInProgress = false;
                    isComplete = true;
                } else if (checklistSearch.data == "ignore") {
                    isInProgress = false;
                    isComplete = false;
                }
            }}>{checklistSearch.data}</button
        >
    </div>

    <div class="flex">
        Sort by: <button
            on:click={() => {
                sortby = sortby.next;
            }}>{sortby.data}</button
        >
    </div>

    <div class="search-container">
        <input type="text" bind:value={textsearch} />
        <button
            on:click={() => {
                promise = getRecords();
            }}>search</button
        >

        <button
            class="listviewtoggle"
            on:click={() => {
                currentview = currentview.next;
            }}
        >
            {currentview.data}
        </button>
    </div>

    {#await promise}
        . . .
    {:then searchresult}
        {#if searchresult}
            <div class="locked container">
                <!-- {board.id} -->
                {#if currentview.data == "Table mode"}
                    <div class="tablegrid-controls">
                        {#each Object.keys(showcard) as showcardval}
                            {#if showcardval != "shortcut"}
                                <div>
                                    <button
                                        class="tablegrid-controls-btn"
                                        class:btnactive={showcard[showcardval]}
                                        on:click={() => {
                                            showcard[showcardval] =
                                                !showcard[showcardval];
                                        }}
                                    >
                                        <div>
                                            {showcardval}
                                        </div>
                                    </button>
                                </div>
                            {/if}
                        {/each}
                    </div>
                {/if}
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

                    {#if currentview.data == "Table mode"}
                        <div class="table-grid">
                            {#each Object.keys(showcard).filter((key) => showcard[key] === true) as showcardval}
                                <div
                                    style={`background-color:var(--header-bg);color:var(--header-color)`}
                                    class="table-grid-key"
                                >
                                    {showcardval}
                                </div>
                            {/each}
                            {#each searchresult.items as card (card.id)}
                                <Tablecard {showcard} {card}></Tablecard>
                            {/each}
                        </div>
                    {:else if currentview.data == "Card mode"}
                        <Sortgrid
                            class="card-grid"
                            on:change={handleDndFinalize}
                        >
                            {#each searchresult.items as card (card.id)}
                                <Card {card}></Card>
                            {/each}
                        </Sortgrid>
                    {/if}
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

    .usergroup-name {
        margin-bottom: 12px;
    }
    .flex {
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .table-grid {
        display: grid;
        grid-column: repeat(auto-fit, minmax(50px, auto));
    }

    .tablegrid-controls-btn {
        opacity: 0.4;
        padding: 2px 11px;
        font-weight: 500;
        font-size: 12px;
        border-radius: 20px;
    }

    .tablegrid-controls-btn.btnactive {
        opacity: 1;
    }

    .tablegrid-controls {
        display: flex;
        gap: 8px;
        background: var(--header-bg);
        padding: 10px;
        border-radius: 4px;
        flex-wrap: wrap;
        margin-bottom: 15px;
    }

    .table-grid-key {
        background: var(--header-bg);
        color: var(--header-color);
        font-weight: bold;
        padding: 4px;
        text-align: center;
    }
</style>
