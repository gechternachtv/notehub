<script>
    // @ts-nocheck
    import CreateBoard from "../CreateBoard/CreateBoard.svelte";
    import dateFormat from "../dateFormat";
    import Card from "../Card/card.svelte";
    import Editor from "./editor.svelte";

    import createNewCard from "../createNewCard";
    import Boardcard from "../Allboards/boardcard.svelte";
    import { pb } from "../pb.js";
    import Modal from "../modal/modal.svelte";
    // import { push } from "svelte-spa-router";
    import { onDestroy } from "svelte";
    import { createEventDispatcher } from "svelte";
    import { localToken } from "../stores.js";

    const dispatch = createEventDispatcher();

    let showModal = false;
    let boardisactive = true;

    //flip

    // import {dndzone} from "svelte-dnd-action";
    import Sortgrid from "./sortcardsgrid.svelte";

    export let boardpage = true;
    export let board = {
        id: "",
        name: "",
        image: "",
        color: "",
        cards: [],
    };

    let canedit = !!board.expand?.usergroup.users?.includes(
        $localToken ? $localToken?.model.id : "???",
    );
    let usergroup = { ...board.expand?.usergroup, id: board.usergroup };

    console.log(usergroup);
    export let listView = undefined;

    export let params = { id: board.id };

    // console.log("%c =-=====", "font-size:30px;color:teal");
    // console.log(board);

    let dragDisabled = false;
    let fileelement;
    let files;
    let editorBlocked = false;
    let editorOpen = false;
    //flip

    let cards = board.expand?.cards ? board.expand.cards : board.cards;

    console.log(board);

    let counter = cards.length;

    async function handleDndFinalize(e) {
        console.log("%c drop details: <<<<<<-----", "color:teal");
        console.log(counter, cards);
        console.log(board.name);
        console.log("%c  ----->>>>>", "color:red");
        console.log(e.detail.tochildren);
        // console.log(cards)
        //log

        //

        // cards = e.detail.items;

        // if(counter<cards.length){
        //     const card = cards.find(o => o.id === e.detail.info.id)
        //     if(board.name === "done"){
        //         card.check = "done"
        //         card.logs = [...card.logs,`card marked as "completed" at ${dateFormat(new Date())}`]
        //     }
        //     const carddata = {...card, logs:[...card.logs,`moved the card to ${board.name} - ${dateFormat(new Date())}`],board:board.id}

        //     console.log(carddata);
        //     await pb.collection('cards').update(e.detail.info.id,carddata);

        // }

        // if(e.detail.fromchildren){
        //     const record = await pb.collection('boards').update(e.detail.fromtarget, {cards:e.detail.fromchildren});
        //     console.log(record)
        // }
        console.log("%c  ----->>>>>", "color:teal;font-size:50px");
        console.log(e.detail);
        e.detail.tochildren.forEach(async (item) => {
            const itemrec = await pb
                .collection("cards")
                .update(item, { board: params.id });
        });
        // const cardrecord = await pb.collection('boards').update(params.id, {cards:e.detail.tochildren});
        const record = await pb
            .collection("boards")
            .update(params.id, { cards: e.detail.tochildren });
        // board = {...record,cards:cards}
        // dispatch('boardupdate',{...board,cards:cards})

        console.log(record);

        counter = e.detail.tochildren.length;
        // dragDisabled = true
    }

    //

    const cardFilter = (cards) => {
        return cards;
    };

    async function getRecords() {
        if (params.id && !params.id.includes("dnd-shadow-placeholder")) {
            try {
                if (board.id === "") {
                    const record = await pb
                        .collection("boards")
                        .getOne(params.id, {
                            expand: "cards.tags,usergroup",
                            fields:
                                `id,img,name,cards,color,collectionId,usergroup,expand.usergroup.users,` +
                                `expand.cards.collectionId,expand.cards.check,expand.cards.created,expand.cards.id,expand.cards.color,` +
                                `expand.cards.file,expand.cards.imglink,expand.cards.favico,expand.cards.title,` +
                                `expand.cards.link,expand.cards.text,` +
                                `expand.cards.expand.tags.name,expand.cards.expand.tags.color`,
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
                    dispatch("boardupdate", board);
                    console.log(board);
                    if (record?.expand) {
                        if (record?.expand.cards) {
                            cards = cardFilter([...record.expand.cards]);
                            counter = cards.length;
                        }
                    }
                    // console.log(records)
                }

                pb.collection("boards").subscribe(
                    params.id,
                    (e) => {
                        console.log("here?");
                        console.log(
                            `%c ${e.action} event on ${board.id}`,
                            "background:turquoise;color:red;font-size:20px",
                        );
                        console.log(e.record);

                        if (e.action === "update") {
                            board = e.record;

                            if (e.record?.expand) {
                                if (e.record?.expand.cards) {
                                    cards = cardFilter([
                                        ...e.record.expand.cards,
                                    ]);
                                    counter = cards.length;
                                    dispatch("boardupdate", {
                                        ...board,
                                        cards: cards,
                                    });
                                } else {
                                    cards = [];
                                    dispatch("boardupdate", {
                                        ...board,
                                        cards: [],
                                    });
                                }
                            } else {
                                cards = [];
                                dispatch("boardupdate", {
                                    ...board,
                                    cards: [],
                                });
                            }
                        } else if (e.action === "delete") {
                            boardisactive = false;
                            pb.collection("boards").unsubscribe(params.id);
                            console.log("deleted!");
                        }
                        console.log("%c ------", "color:teal");
                        // views = e.record
                    },
                    {
                        expand: "cards.tags,usergroup,authors",
                        fields:
                            `id,img,name,cards,color,collectionId,usergroup,expand.usergroup.users,` +
                            `expand.cards.collectionId,expand.cards.check,expand.cards.created,expand.cards.id,expand.cards.color,` +
                            `expand.cards.file,expand.cards.imglink,expand.cards.favico,expand.cards.title,` +
                            `expand.cards.link,expand.cards.text,` +
                            `expand.cards.expand.tags.name,expand.cards.expand.tags.color`,
                    },
                );

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
        editorBlocked = true;
        window.scrollTo(0, 0);
        document
            .querySelector(".card-grid")
            .setAttribute("style", `max-height: 300px;opacity:0.6`);
        debugger;

        const card = await createNewCard(
            usergroup?.id,
            e.detail,
            [$localToken?.model.id],
            fileelement,
        );
        debugger;
        document.querySelector(".card-grid").setAttribute("style", ``);
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

        const newcardlist = [cardrecord.id, ...cards.map((e) => e.id)];
        const boarddata = {
            cards: newcardlist,
        };

        const boardrecord = await pb
            .collection("boards")
            .update(board.id, boarddata);

        // card.id = cardrecord.id

        // cards = cardFilter([{...cardrecord,tags:card.tags},...cards])

        // board = boardrecord

        fileelement.value = "";
        files = fileelement.files;
        window.scrollTo(0, 0);
        editorBlocked = false;
    };

    const handleUpdate = async (e) => {
        console.log("DETAIL:");
        console.log(e.detail);
        if (e.detail.img === undefined || e.detail.img === "") {
            delete e.detail.img;
        }
        if (e.detail.name === undefined || e.detail.name === "") {
            delete e.detail.name;
        }
        if (e.detail.color === undefined || e.detail.color === "") {
            delete e.detail.color;
        }

        console.log({ ...board, ...e.detail });
        const record = await pb.collection("boards").update(board.id, {
            color: e.detail.color,
            img: e.detail.img,
            name: e.detail.name,
            // cards: cards.map((e) => e.id),
        });
        console.log(record);
        board = record;
        dispatch("boardupdate", board);
        showModal = false;
    };

    const cardUpdateFront = (e) => {
        console.log(e);
        const cardNewInfo = e.detail;
        const oldinfoCard =
            cards[cards.findIndex((e) => e.id === cardNewInfo.id)];
        cards[cards.findIndex((e) => e.id === cardNewInfo.id)] = {
            ...cardNewInfo,
            expand: oldinfoCard.expand,
        };
        board.cards = cards;
        board = board;
        dispatch("boardupdate", board);
        console.log(board.cards);
    };

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
    {#if boardisactive}
        <!-- content here -->

        {#await promise then views}
            <div class:locked={!canedit} class="container">
                <!-- {board.id} -->
                <Boardcard {board} />
                {#if boardpage}
                    <div class="controls">
                        {#if canedit}
                            <button on:click={() => (showModal = true)}>
                                Edit board
                            </button>
                        {/if}

                        <button
                            class="listviewtoggle"
                            on:click={handleListViewChange}
                        >
                            {listView ? "Card mode" : "List mode"}
                        </button>
                    </div>
                {:else}
                    <button
                        class="editorOpentoggle"
                        on:click={() => (editorOpen = !editorOpen)}
                        >{editorOpen ? "-" : "+"}</button
                    >
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

                    <Sortgrid
                        class="card-grid {listView ? 'list' : ''}"
                        on:change={handleDndFinalize}
                    >
                        {#each cards as card (card.id)}
                            <Card
                                {listView}
                                {card}
                                on:updatefront={cardUpdateFront}
                            ></Card>
                        {/each}
                    </Sortgrid>

                    {#if editorOpen && canedit}
                        <div class="con conworkspace">
                            <div class:editorBlocked class="editor">
                                <Editor
                                    bind:editorBlocked
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
                        <div class:editorBlocked class="editor">
                            <Editor
                                bind:editorBlocked
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
</style>
