<script>
    // @ts-nocheck

    import Card from "../Card/card.svelte";
    import { pb } from "../pb.js";
    import Calendarselector from "./calendarselector.svelte";
    import { onMount } from "svelte";
    import { localToken, texttemplate } from "../stores.js";
    import Boardcard from "../Allboards/boardcard.svelte";
    import { push } from "svelte-spa-router";

    //flip

    // import {dndzone} from "svelte-dnd-action";
    import Sortgrid from "../Boardpage/sortcardsgrid.svelte";

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
    let sortby = "newest";
    let currentDay;
    let currentBoards = [];
    let showcreated = true;
    let showmentions = true;
    // let searchtag = "";
    let filter = `(board.usergroup.users ~ "${$localToken.model.id}" || board.usergroup.public = "global-view")`;

    //

    function formatNumber(num) {
        return Number(num) < 10 ? "0" + Number(num) : Number(num).toString();
    }

    async function getRecords() {
        try {
            const resultList = await pb.collection("cards").getList(1, 60, {
                filter: filter,
                sort: `${sortby === "oldest" ? "" : "-"}created`,
                expand: "tags,board",
            });

            // console.log("aqui:");
            // console.log(resultList);

            return resultList;
        } catch (error) {
            console.warn(error);
        }
    }

    let promise;
    let hascontent = false;

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
    const handlenewday = (e) => {
        if ($localToken) {
            console.log($localToken.model.calendar_board);
            if ($localToken.model?.calendar_board) {
                $texttemplate = {
                    type: "json",
                    value: {
                        type: "doc",
                        content: [
                            {
                                type: "paragraph",
                                content: [
                                    {
                                        type: "text",
                                        text: `@${e.detail.day}-${e.detail.month}-${e.detail.year}`,
                                    },
                                ],
                            },
                            {
                                type: "paragraph",
                            },
                        ],
                    },
                };

                console.log($texttemplate);
                push(`/board/${$localToken.model.calendar_board}?usetemplate`);
            }
        }
    };
    const handledayclick = (e) => {
        currentDay = e.detail;
        console.log(e.detail);
        remakePromise();
    };

    const remakePromise = () => {
        filter = `(
    (
      ${
          showcreated
              ? `created >= "${currentDay.year}-${formatNumber(currentDay.month)}-${formatNumber(currentDay.day)} 00:00:00"
           && created <= "${currentDay.year}-${formatNumber(currentDay.month)}-${formatNumber(currentDay.day)} 23:59:59"`
              : `1=0`
      }
    )
    ||
    (
      ${
          showmentions
              ? `datementions ~ "${formatNumber(currentDay.day)}-${formatNumber(currentDay.month)}-${currentDay.year}"`
              : `1=0`
      }
    )
  )
  && (board.usergroup.users ~ "${$localToken.model.id}" || board.usergroup.public = "global-view")`;

        promise = getRecords().then((e) => {
            if (e?.items?.length) {
                hascontent = true;

                const boards = new Map();
                e.items.forEach((x) => {
                    if (
                        x.created.includes(
                            `${formatNumber(currentDay.year)}-${formatNumber(currentDay.month)}-${currentDay.day}`,
                        )
                    ) {
                        x.iscreated = true;
                    } else {
                        x.ismentions = true;
                    }
                    x.expand?.board;
                    if (boards.get(x.expand?.board.id)) {
                        boards.set(x.expand.board.id, {
                            board: x.expand.board,
                            cards: [...boards.get(x.expand?.board.id).cards, x],
                        });
                    } else {
                        boards.set(x.expand.board.id, {
                            board: x.expand.board,
                            cards: [x],
                        });
                    }
                });

                console.log("map:");
                console.log(boards);
                currentBoards = Array.from(boards);
                return currentBoards;
            } else {
                hascontent = false;
                return false;
            }
        });
    };

    const handlefilterchange = (e) => {
        console.log(e.detail);
        let previousshowcreated = showcreated;
        let previousshowmentions = showmentions;
        showcreated = e.detail.showcreated;
        showmentions = e.detail.showmentions;

        if (
            (previousshowcreated === false && showcreated === true) ||
            (previousshowmentions === false && showmentions === true)
        ) {
            remakePromise();
        } else {
            promise = new Promise((resolve) => {
                let filteredBoards = currentBoards;
                console.log("filteredBoards");

                if (!showcreated) {
                    filteredBoards.forEach((board) => {
                        board[1].cards = board[1].cards.filter(
                            (a) => !a.iscreated,
                        );
                    });
                    filteredBoards = filteredBoards.filter((board) => {
                        return board[1].cards.length > 0;
                    });
                }
                if (!showmentions) {
                    filteredBoards.forEach((board) => {
                        board[1].cards = board[1].cards.filter(
                            (a) => !a.ismentions,
                        );
                    });
                    filteredBoards = filteredBoards.filter((board) => {
                        return board[1].cards.length > 0;
                    });
                }
                if (filteredBoards.length === 0) {
                    hascontent = false;
                }
                return resolve(filteredBoards);
            });
        }
    };
</script>

<main class:hascontent>
    <div class="calendar-wrapper">
        <Calendarselector
            on:filterchange={handlefilterchange}
            on:dayclick={handledayclick}
            on:newday={handlenewday}
        ></Calendarselector>
    </div>

    {#await promise then searchresult}
        {#if searchresult?.length}
            <div
                class="calendar-result minicard-container calendarcard-container"
            >
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

                        {#each searchresult as board}
                            {#if board[1].cards}
                                <Boardcard
                                    workspacecard={true}
                                    board={board[1].board}
                                />
                                <div
                                    style="border-left:4px solid {board[1].board
                                        .color}"
                                >
                                    <Sortgrid class="card-grid list">
                                        {#each board[1].cards as card (card.id)}
                                            <Card {card}></Card>
                                        {/each}
                                    </Sortgrid>
                                </div>
                            {/if}
                        {/each}

                        <!--  -->
                    </div>
                </div>
            </div>
        {/if}
    {:catch error}
        {error}
    {/await}
</main>

<style>
    .button-container {
        display: flex;
        gap: 6px;
    }
    .calendar-result {
        width: 100%;
        height: 306px;
        overflow: scroll;
    }
    .calendar-wrapper {
        min-width: 300px;
        display: flex;
        flex-direction: column;
    }
    main {
        position: relative;
        display: flex;
        gap: 30px;
        margin-left: 0;
        min-height: 347px;
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
        margin-left: 0;
        /* max-width: var(--container); */
        width: auto;
        /* padding-bottom: 20px; */
    }

    main.hascontent {
        width: 100%;
        max-width: 856px;
    }

    .grid-container {
        max-height: var(--board-height);
        overflow: scroll;
    }

    .container {
        padding: 0px;
        container-type: inline-size;
        container-name: card-container;
        height: 100%;
        width: 100%;
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

    /* @media (max-width: 991px) {
        .listviewtoggle {
            display: none;
        }
    } */

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
        padding: min(20px, 2vw);
        border-radius: 10px;
    }
</style>
