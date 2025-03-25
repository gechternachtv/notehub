<script>
    // @ts-nocheck

    import Card from "../Card/card.svelte";
    import { pb } from "../pb.js";
    import { localToken } from "../stores.js";
    import { querystring } from "svelte-spa-router";
    import { onMount } from "svelte";

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
    let hasparam;
    let usergroupid = false;
    let tagsORAND = "&&";

    let checklistSearch = "ignore";
    let isInProgress = false;
    let isComplete = false;

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

            const resultList = await pb.collection("cards").getList(1, 60, {
                filter: `(${searchtags.length > 0 ? `(${searchtags.map((e, i) => `tags ?~ "${e}" ${i === searchtags.length - 1 ? "" : `${tagsORAND}`}`).join(" ")}) &&` : ``} (${includeraw ? `raw ?~ "${textsearch}" || ` : ""}text ~ "${textsearch}" || title ~ "${textsearch}" || link ~ "${textsearch}" || file ~ "${textsearch}") ${needslink ? `&& link != ""` : ""} ${needsimg ? `&& (imglink != "" || file ~ "jpg" || file ~ "png" || file ~ "gif" || file ~ "webp")` : ""} ${needsfile ? `&& file != ""` : ""}) ${$localToken ? `&& board.usergroup.users ~ "${$localToken?.model?.id}" ${usergroupid ? ` && board.usergroup = "${usergroupid}"` : ""}` : ` && board.usergroup.public = "global-view" `}  ${isInProgress ? `&& done > 0 && done < 100` : isComplete ? `&& done = 100` : ``}`,
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

    onMount(() => {
        if (hasparam) {
            promise = getRecords();
        }
    });
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
                if (checklistSearch === "ignore") {
                    checklistSearch = "in progress";
                    isInProgress = true;
                    isComplete = false;
                } else if (checklistSearch == "in progress") {
                    checklistSearch = "completed";
                    isInProgress = false;
                    isComplete = true;
                } else {
                    checklistSearch = "ignore";
                    isInProgress = false;
                    isComplete = false;
                }
            }}>{checklistSearch}</button
        >
    </div>

    <div class="flex">
        Sort by: <button
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
</style>
