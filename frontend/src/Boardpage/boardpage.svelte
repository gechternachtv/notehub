<script>
    // @ts-nocheck
    import CreateBoard from "../CreateBoard/CreateBoard.svelte";
    import dateFormat from "../dateFormat";
    import Card from "../Card/card.svelte";
    import Tablecard from "../Card/tablecard.svelte";
    import Editor from "./editor.svelte";

    import createNewCard from "../createNewCard";
    import Boardcard from "../Allboards/boardcard.svelte";
    import { pb } from "../pb.js";
    import Modal from "../modal/modal.svelte";
    // import { push } from "svelte-spa-router";
    import { onDestroy } from "svelte";
    import { createEventDispatcher } from "svelte";
    import { localToken, editorblocked } from "../stores.js";
    import Contextmenu from "../contextmenu.svelte";

    import { querystring } from "svelte-spa-router";

    import contrastcolor from "../contrastcolor";
    import LinkedList from "../linkedlist";

    editorblocked.set(false);

    const dispatch = createEventDispatcher();

    let editordefaultValue = {
        type: "json",
        value: {
            type: "doc",
            content: [
                {
                    type: "paragraph",
                    content: [
                        {
                            type: "text",
                            text: " ",
                        },
                    ],
                },
            ],
        },
    };

    let showModal = false;
    let boardisactive = true;

    let canmove = true;

    //flip

    import Sortgrid from "./sortcardsgrid.svelte";

    export let boardpage = true;
    export let board = {
        id: "",
        name: "",
        image: "",
        color: "",
        cards: [],
    };

    export let workspace;

    const urlparams = new URLSearchParams($querystring);
    const workspacename = urlparams.get("workspacename");
    const workspaceid = urlparams.get("workspaceid");
    if (workspacename && workspaceid) {
        workspace = {
            id: workspaceid,
            name: workspacename,
        };
    }

    const showcardlocalstorage = localStorage.getItem("showcard"); // Retrieve data from localStorage
    const parsedShowcardData = showcardlocalstorage
        ? JSON.parse(showcardlocalstorage)
        : null;

    let showcard = {
        shortcut: true,
        id: true,
        img: true,
        title: true,
        text: true,
        tags: true,
        created: true,
        targetdate: true,
        progress: true,
    };

    if (parsedShowcardData && typeof parsedShowcardData === "object") {
        Object.keys(showcard).forEach((key) => {
            showcard[key] = parsedShowcardData[key];
        });
    }

    let canedit = !!board.expand?.usergroup.users?.includes(
        $localToken ? $localToken?.model.id : "???",
    );
    let usergroup = { ...board.expand?.usergroup, id: board.usergroup };

    // export let listView = undefined;

    export let params = { id: board.id };

    let dragDisabled = false;
    let fileelement;
    let files;

    let editorOpen = false;
    //flip

    let cardsFull = board.expand?.cards ? board.expand?.cards : [];

    let counter = cardsFull.length;
    let currentCardsList = board.cards;

    let currentview = new LinkedList();
    ["Card mode", "Table mode"].forEach((mode) => {
        if (boardpage && localStorage.getItem("currentview") === mode) {
            currentview.append(mode, true);
        } else {
            currentview.append(mode);
        }
    });

    currentview = currentview.head;

    // console.log(currentCardsList);
    async function handleDndFinalize(e) {
        console.log(e.detail);

        canmove = false;
        currentCardsList = e.detail.tochildren;
        //board.cards = currentCardsList;
        counter = currentCardsList.length;

        if (e.detail.type === "add" || e.detail.type === "update") {
            console.log("%c updatedd", "color:red");
            try {
                const record = await pb
                    .collection("boards")
                    .update(params.id, { cards: e.detail.tochildren });

                canmove = true;
            } catch (error) {
                console.error(error);
            }
        } else {
            canmove = true;
        }
    }

    async function getRecords() {
        if (params.id && !params.id.includes("dnd-shadow-placeholder")) {
            try {
                if (board.id === "") {
                    const record = await pb
                        .collection("boards")
                        .getOne(params.id, {
                            expand: "cards.tags,usergroup",
                            fields:
                                `id,img,name,cards,color,collectionId,usergroup,expand.usergroup.users,expand.usergroup.name,expand.usergroup.id,expand.usergroup.public,` +
                                `expand.cards.collectionId,expand.cards.created,expand.cards.id,expand.cards.color,` +
                                `expand.cards.file,expand.cards.imglink,expand.cards.favico,expand.cards.title,` +
                                `expand.cards.link,expand.cards.text,expand.cards.done,expand.cards.datementions,` +
                                `expand.cards.expand.tags.name,expand.cards.expand.tags.id,expand.cards.expand.tags.color,expand.cards.expand.tags.usergroup,description`,
                        });

                    console.log(record);
                    usergroup = {
                        ...record.expand?.usergroup,
                        id: record.usergroup,
                    };

                    canedit = record.expand?.usergroup.users?.includes(
                        $localToken ? $localToken?.model.id : "???",
                    );
                    board = record;
                    currentCardsList = board.cards;
                    // dispatch("boardupdate", board);
                    //  // console.log(board);
                    if (record?.expand) {
                        if (record?.expand.cards) {
                            cardsFull = [...record.expand.cards];
                            counter = cardsFull.length;
                        }
                    }

                    canmove = true;

                    //title
                    document.querySelector("title").innerHTML =
                        record.expand?.usergroup.name + " ➜ " + board.name;
                    //  // console.log(records)
                }
                if (boardpage) {
                    pb.collection("boards").subscribe(
                        params.id,
                        (e) => {
                            //console.log(e);

                            if (e.action === "update") {
                                //console.log(e);

                                console.log(e);

                                console.log(currentCardsList.join(","));
                                console.log(e.record.cards.join(","));
                                // currentCardsList.join(",") !=
                                //         e.record.cards.join(",")
                                if (
                                    currentCardsList.join(",") !=
                                        e.record.cards.join(",") ||
                                    board.color != e.record.color ||
                                    board.name != e.record.name ||
                                    board.img != e.record.img
                                ) {
                                    board.color = e.record.color;
                                    board.name = e.record.name;
                                    board.img = e.record.img;
                                    board.expand = e.record.expand;
                                    currentCardsList = e.record.cards;

                                    console.log(
                                        "%c re-reder needed!",
                                        "color:orange",
                                    );
                                    console.log(board);

                                    board = e.record;

                                    counter = currentCardsList.length;

                                    if (board.expand?.cards) {
                                        cardsFull = [...board.expand.cards];

                                        // dispatch("boardupdate", board);
                                    } else {
                                        cardsFull = [];
                                        // dispatch("boardupdate", {
                                        //     ...board,
                                        //     cards: [],
                                        // });
                                    }
                                }
                            } else if (e.action === "delete") {
                                boardisactive = false;
                                pb.collection("boards").unsubscribe(params.id);
                                // console.log("deleted!");
                            }
                        },
                        {
                            expand: "cards.tags,usergroup,authors",
                            fields:
                                `id,img,name,cards,color,collectionId,usergroup,expand.usergroup.users,expand.usergroup.name,expand.usergroup.id,expand.usergroup.public,` +
                                `expand.cards.collectionId,expand.cards.created,expand.cards.id,expand.cards.color,` +
                                `expand.cards.file,expand.cards.imglink,expand.cards.favico,expand.cards.title,` +
                                `expand.cards.link,expand.cards.text,expand.cards.done,expand.cards.datementions,` +
                                `expand.cards.expand.tags.name,expand.cards.expand.tags.id,expand.cards.expand.tags.color,expand.cards.expand.tags.usergroup`,
                        },
                    );
                }
                return board;
            } catch (error) {
                console.warn(error);
            }
        }
    }

    onDestroy(() => {
        pb.collection("boards").unsubscribe(params.id);
    });

    let promise = getRecords();

    //array.sort((a, b) => a.id - b.id);

    const handleNewCard = async (e) => {
        editorblocked.set(true);
        window.scrollTo(0, 0);
        document
            .querySelector(".card-grid")
            ?.setAttribute("style", `max-height: 300px;opacity:0.6`);

        const card = await createNewCard(
            usergroup?.id,
            e.detail,
            [$localToken?.model.id],
            board.id,
            fileelement,
        );

        document.querySelector(".card-grid")?.setAttribute("style", ``);

        window.scrollTo(0, 0);

        const data = {
            ...card,
            tags: card.tags.map((e) => e.id),
            logs: [
                `card created on ${board.name} at ${dateFormat(new Date())}`,
            ],
            board: board.id,
        };

        const cardrecord = await pb.collection("cards").create(data);

        const newcardlist = [cardrecord.id, ...cardsFull.map((e) => e.id)];
        const boarddata = {
            cards: newcardlist,
        };

        // const boardrecord = await pb
        //     .collection("boards")
        //     .update(board.id, boarddata);

        // card.id = cardrecord.id

        // cards = cardFilter([{...cardrecord,tags:card.tags},...cards])

        // board = boardrecord
        if (fileelement) {
            fileelement.value = "";
        }

        window.scrollTo(0, 0);
        editorblocked.set(false);
        setTimeout(() => {
            document.querySelector(".ProseMirror.editor")?.focus();
        }, 200);
    };

    const handleUpdate = async (e) => {
        // console.log("DETAIL:");
        // console.log(e.detail);

        if (e.detail.img === undefined || e.detail.img === "") {
            delete e.detail.img;
        }
        if (e.detail.name === undefined || e.detail.name === "") {
            delete e.detail.name;
        }
        if (e.detail.color === undefined || e.detail.color === "") {
            delete e.detail.color;
        }

        // console.log({ ...board, ...e.detail });
        const record = await pb.collection("boards").update(board.id, {
            color: e.detail.color,
            img: e.detail.img,
            name: e.detail.name,
            description: e.detail.description,
        });
        console.log(record);

        showModal = false;
        promise = new Promise((resolve, reject) => {
            resolve({ ...record, expand: board.expand });
        });
    };

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
</script>

<!-- <svelte:head>
    {#if workspacename}
        <title>{workspacename}</title>
    {/if}
</svelte:head> -->

<main class:paddingtop={boardpage}>
    {#if boardisactive}
        <!-- content here -->

        {#await promise then board}
            <Contextmenu>
                <div class="breadcrumb">
                    <div class="contextmenu-link">
                        <a href="/#/usergroup/{board?.expand?.usergroup.id}"
                            >{board?.expand?.usergroup.name}
                        </a>

                        {#if workspacename && workspaceid}
                            ➜
                            <a href="/#/workspace/{workspaceid}"
                                >{workspacename}
                            </a>
                        {/if}
                    </div>
                    ➜ {board.name}
                </div>
            </Contextmenu>
            <div
                class:locked={!canedit}
                class:canmove={!canmove}
                class="container"
            >
                <span
                    class="debug debug-id"
                    style="background:{canmove ? 'teal' : 'tomato'}"
                    >{board.id}</span
                >
                <div class="debug" style="background:orange">
                    {JSON.stringify(currentCardsList)}
                </div>

                <Boardcard {workspace} {board} {counter} />

                {#if boardpage}
                    {#if board.description}
                        <div class="board-description">
                            {board.description}
                        </div>
                    {/if}

                    <div class="controls">
                        {#if canedit}
                            <button on:click={() => (showModal = true)}>
                                Edit
                            </button>
                        {/if}

                        <button
                            class="listviewtoggle"
                            on:click={() => {
                                currentview = currentview.next;
                                localStorage.setItem(
                                    "currentview",
                                    currentview.data,
                                );
                            }}
                        >
                            {currentview.data}
                        </button>
                    </div>
                {:else}
                    <button
                        class="editorOpentoggle"
                        on:click={() => (editorOpen = !editorOpen)}
                        >{editorOpen ? "-" : "+"}</button
                    >
                {/if}

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

                                            localStorage.setItem(
                                                "showcard",
                                                JSON.stringify(showcard),
                                            );
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
                                    style={`background-color:${board.color};color:${contrastcolor(board.color, "#131313", "#e1e1e1", "var(--card-bg)")}`}
                                    class="table-grid-key"
                                >
                                    {showcardval}
                                </div>
                            {/each}
                            {#each cardsFull as card (card.id)}
                                <Tablecard {showcard} {card} {workspace}
                                ></Tablecard>
                            {/each}
                        </div>
                    {:else if currentview.data == "Card mode"}
                        <Sortgrid
                            class="card-grid"
                            on:change={handleDndFinalize}
                        >
                            {#each cardsFull as card (card.id)}
                                <Card {card} {workspace}></Card>
                            {/each}
                        </Sortgrid>
                    {/if}

                    {#if editorOpen && canedit}
                        <div class="con conworkspace">
                            <div
                                class:editorBlocked={$editorblocked}
                                class="editor"
                            >
                                <Editor
                                    defaultValue={editordefaultValue}
                                    bind:files
                                    bind:fileelement
                                    on:newcontent={handleNewCard}
                                ></Editor>
                            </div>
                        </div>
                    {/if}
                </div>

                {#if boardpage && canedit}
                    <div class="con condesktop">
                        <div
                            class:editorBlocked={$editorblocked}
                            class="editor"
                        >
                            <Editor
                                defaultValue={editordefaultValue}
                                bind:files
                                bind:fileelement
                                on:newcontent={handleNewCard}
                            ></Editor>
                        </div>

                        <div class="boardedit">
                            <Modal bind:showModal>
                                <CreateBoard
                                    on:newcontent={handleUpdate}
                                    {board}
                                    usergroup={usergroup?.id}
                                />
                            </Modal>
                        </div>
                    </div>
                {/if}
            </div>
        {/await}
    {:else}
        this board was deleted
    {/if}
</main>

<style>
    main {
        position: relative;
    }

    .con {
        display: grid;
        grid-template-columns: 1fr;
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
        z-index: 2;
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

    .board-usergroupbread {
        display: block;
        margin-bottom: 20px;
        display: inline-block;
        background: var(--button-bg);
        color: var(--button-color);
        width: auto;
        padding: 3px 11px;
        border-radius: 10px;
    }

    .board-description {
        font-size: 1.3rem;
        padding: 20px 0;
        padding-top: 0px;
        color: var(--board-title-color);
    }

    .paddingtop {
        padding-top: 20px;
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
