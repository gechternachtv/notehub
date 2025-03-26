<script>
    // @ts-nocheck
    import { pop } from "svelte-spa-router";
    import { pb } from "../pb.js";
    import { createEventDispatcher } from "svelte";
    import dateFormat from "../dateFormat.js";
    import getFile from "../getFile.js";
    import Confirmaction from "../confirmaction.svelte";
    import colorsames from "../colorsnames";
    import Modal from "../modal/modal.svelte";
    import Moveoptions from "../Card/moveoptions.svelte";
    import Boardcard from "../Allboards/boardcard.svelte";
    import { localToken, server, editorblocked } from "../stores.js";

    import { onMount } from "svelte";

    export let card = {
        id: "",
        check: "",
    };
    export let fullView = false;
    export let listView = false;

    let cssel;

    onMount(() => {
        cssel.classList.add("customCardCss");
        const codeBlock = card.raw.find((e) => e.attrs?.language === "style");
        const codeBlockImg = card.raw.find((e) => e.attrs?.language === "img");
        const codeBlockheadings = card.raw.find(
            (e) => e.attrs?.language === "h",
        );
        const codeBlockp = card.raw.find((e) => e.attrs?.language === "p");

        if (codeBlock) {
            cssel.innerHTML += `

    .milkdown {
        ${codeBlock.content.map((a) => a.text).join("\n")}
    }`;
        }

        if (codeBlockImg) {
            cssel.innerHTML += `

    .milkdown img{
        ${codeBlockImg.content.map((a) => a.text).join("\n")}
    }`;
        }

        if (codeBlockheadings) {
            cssel.innerHTML += `

    .milkdown h1,.milkdown h2,.milkdown h3,.milkdown h4,.milkdown h5,.milkdown h6,.milkdown h7,.milkdown h8{
        ${codeBlockheadings.content.map((a) => a.text).join("\n")}
    }`;
        }

        if (codeBlockp) {
            cssel.innerHTML += `

    .milkdown p{
        ${codeBlockp.content.map((a) => a.text).join("\n")}
    }`;
        }
    });

    function closestDate(dates) {
        console.log(dates);
        if (dates.length) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize time for accurate comparison

            const futureDates = dates
                .map((dateStr) => {
                    const [day, month, year] = dateStr.split("-").map(Number);
                    const dateObj = new Date(year, month - 1, day);
                    return { dateStr, dateObj };
                })
                .filter(({ dateObj }) => dateObj >= today);

            if (futureDates.length > 0) {
                const closest = futureDates.sort(
                    (a, b) => a.dateObj - b.dateObj,
                )[0];
                const timeDiff =
                    (closest.dateObj - today) / (1000 * 60 * 60 * 24); // Convert ms to days

                var status = "upcoming";

                if (timeDiff < 1) {
                    status = "today";
                } else if (timeDiff < 3) {
                    status = "warning";
                }

                return {
                    date: futureDates.sort((a, b) => a.dateObj - b.dateObj)[0]
                        .dateObj,
                    status: status,
                };
            }

            // If no future date exists, return the most recent past date
            return {
                date:
                    dates
                        .map((dateStr) => {
                            const [day, month, year] = dateStr
                                .split("-")
                                .map(Number);
                            const dateObj = new Date(year, month - 1, day);
                            return { dateStr, dateObj };
                        })
                        .sort((a, b) => b.dateObj - a.dateObj)[0]?.dateObj ||
                    null,
                status: "passed",
            };
        }
    }

    console.log(card);

    let readmode = true;

    editorblocked.set(readmode);

    let date;

    let duedate;

    $: {
        if (card.datementions) {
            duedate = closestDate(card.datementions.split(","));
        }

        if (card.done) {
            if (card.done == 100) {
                if (duedate) {
                    duedate.status = "done";
                }
            }
        }
    }

    let showconfirmbox = false;
    let showModalMove = false;
    const dispatch = createEventDispatcher();
    const setInfo = (card) => {
        // checked = card.check === "done";
        date = dateFormat(new Date(card.created));
    };
    window.scrollTo(0, 0);
    const handleDelete = async (e) => {
        await pb.collection("cards").delete(card.id);
        pop();
    };

    const linkPreview = (c) => {
        const icon = c.link
            ? "🔗 "
            : c.imglink
              ? "🔗 "
              : c.file
                ? getFile(c).type === "image/jpeg"
                    ? "🖼️"
                    : getFile(c).type === "Video"
                      ? "🎞️"
                      : getFile(c).type === "Audio"
                        ? "🔈"
                        : "📄"
                : "";

        const link = c.link
            ? c.link
            : c.imglink
              ? c.imglink
              : c.file
                ? c.file
                : "";
        const limitlink = link.slice(0, 80);
        return `${icon} ${limitlink} ${link.length > 80 ? ". . ." : ""}`;
    };

    let checked = card.check === "done";
    // const handleCheckbox = async () => {
    //     const record = await pb.collection("cards").update(card.id, {
    //         ...card,
    //         check: checked ? "done" : "islist",
    //         logs: [
    //             ...card.logs,
    //             `card marked as ${checked ? "completed" : "incomplete"} at ${dateFormat(new Date())}`,
    //         ],
    //     });
    //     card = record;
    //     setInfo(card);
    //     dispatch("updatefront", card);
    // };
    // const handlemovetoBoard = async ()=>{ console.log("hey")}
    const handlemovetoBoard = async () => {
        showModalMove = true;
        // movetoBoard("tw5augb2ospnnzx")
    };

    const handleDuplicate = async () => {
        try {
            const newCard = { ...card };
            delete newCard["id"];
            delete newCard["created"];
            delete newCard["expand"];
            delete newCard["file"];

            if (newCard.imglink === "" || !newCard.imglink) {
                if (typeof card.file == "string") {
                    if (
                        /\.(png|jpe?g|gif|bmp|webp|svg|tiff?)$/i.test(card.file)
                    ) {
                        console.log(typeof card.file);
                        const newimagelink = `${$server.url}/api/files/${card.collectionId}/${card.id}/${card.file}`;
                        console.log(newimagelink);
                        newCard.imglink = newimagelink;

                        console.log(typeof newCard.raw);
                        if (typeof newCard.raw == "object") {
                            if (newCard.raw.push) {
                                const newimgobj = {
                                    type: "paragraph",
                                    content: [
                                        {
                                            type: "image",
                                            attrs: {
                                                src: newimagelink,
                                                alt: "",
                                                title: "",
                                            },
                                        },
                                    ],
                                };

                                newCard.raw = [newimgobj, ...newCard.raw];
                                console.log(newCard.raw);
                            }
                        }
                    }
                }
            }

            const jsonString = JSON.stringify(newCard.raw).replace(
                /"checked":true/g,
                '"checked":false',
            );
            if (jsonString.includes("checked")) {
                newCard.done = 1;
            }
            newCard.raw = JSON.parse(jsonString);

            console.log(newCard);
            const record = await pb.collection("cards").create(newCard);
            console.log(record);
        } catch (error) {
            console.error(error);
        }
    };

    const movetoBoard = async (boardtoinsert) => {
        console.log(boardtoinsert);
        const record = await pb.collection("cards").update(card.id, {
            board: boardtoinsert.id,
        });
        console.log(record);
        card.board = boardtoinsert.id;
        card.expand.board = boardtoinsert;
    };
    //     showModal = false;
    //     const currentboard = await pb
    //         .collection("boards")
    //         .getOne(card.board, { fields: "cards" });
    //     await pb.collection("boards").update(card.board, {
    //         cards: currentboard.cards.filter((e) => e != card.id),
    //     });

    //     const newboard = await pb
    //         .collection("boards")
    //         .getOne(boardtoinsert, { fields: "cards" });
    //     await pb
    //         .collection("boards")
    //         .update(boardtoinsert, { cards: [card.id, ...newboard.cards] });

    //     const record = await pb
    //         .collection("cards")
    //         .update(card.id, { board: boardtoinsert });

    //     card = record;
    // };

    setInfo(card);

    // console.log(getFile(card))
</script>

<div
    id={card.id}
    class="card"
    class:fullview={fullView}
    class:listview={listView}
    class:locked={readmode}
    style="border-left: 3px solid {card.color}"
>
    <Modal bind:showModal={showModalMove}>
        <Moveoptions
            usergroup={card?.expand?.board?.usergroup}
            isopen={showModalMove}
            currentboard={{ id: card.board }}
            on:submit={(e) => {
                movetoBoard(e.detail);
            }}
        ></Moveoptions>
    </Modal>
    <!-- {card.board} -->
    <!-- <object title="stealth_operation_8VgOQaQdlq.mp3" data="{card.img}">Cannot preview the file.</object> -->

    <style bind:this={cssel}></style>

    <div class="card-container card-container---image">
        <div class="grabber">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="16"
                height="16"
                transform="matrix(1, 0, 0, 1, 0, 0)"
                ><path
                    d="M10 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm-4 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm5-9a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                    fill="var(--button-bg)"
                /></svg
            >
        </div>

        <div class="thumb">
            <!-- {#if channel.thumb} -->
            <!-- <img loading=lazy src="{channel.thumb}" alt=""> -->
            <a class="img-c thumblink" href="/#/card/{card.id}">
                {#if card.file}
                    {#if getFile(card).type === "image/jpeg"}
                        <img loading="lazy" src={getFile(card).link} alt="" />
                    {:else if getFile(card).type && fullView}
                        <object
                            loading="lazy"
                            title={card.id}
                            data={getFile(card).link}
                            ><a href={getFile(card).link} target="_blank"
                                >{card.file}</a
                            ></object
                        >
                    {/if}
                {:else if card.imglink}
                    <img loading="lazy" src={card.imglink} alt="" />
                {/if}

                <!-- {/if} -->
            </a>
        </div>
    </div>
    <div class="card-container card-container---info">
        <!-- <div class="title">{channel.name}</div> -->
        <!-- <div class="hostName">{channel.host}</div> -->
        <a class="nodeco" href="/#/card/{card.id}">
            <div class="title">
                <img
                    style="max-width:16px"
                    loading="lazy"
                    src={card.favico}
                    alt=""
                />
                {card.title}
            </div>
            <div class="link">{linkPreview(card)}</div>
        </a>
        <!-- {#if card.check}
            {#if card.check === "done" || card.check === "islist"}
                <div class:checked class="inputholder">
                    <label
                        ><input
                            type="checkbox"
                            name=""
                            bind:checked
                            on:change={handleCheckbox}
                        /> done</label
                    >
                </div>
            {/if}
        {/if} -->

        <!-- <a class="nodeco" href="/#/card/{card.id}">
                    <div class="updates">{card.text}</div>
                </a> -->
        <div class="date">📅 {date}</div>
        {#if card.datementions}
            {#if card.datementions.split(",").length > 0}
                <div class="duedate {duedate.status}">
                    📆 {dateFormat(duedate.date, false)}
                </div>
            {/if}
        {/if}

        {#if card.expand?.tags}
            {#if card.expand?.tags.length > 0}
                <div class="tags">
                    {#each card.expand?.tags as tag}
                        {#if tag.name != undefined}
                            <div class="tagcolor-container">
                                <a
                                    href="/#/search?tag={tag.id}&usergroup={card
                                        .expand.board.usergroup}"
                                    class="tag"
                                    style="background:{tag.color};"
                                    >{tag.name}</a
                                >
                                <label class="labelcolor" for="color-{tag.name}"
                                    >🖉
                                    <input
                                        id="color-{tag.name}"
                                        class="color"
                                        type="color"
                                        value={colorsames(tag.color)}
                                        on:change={async (e) => {
                                            console.log(e.target.value);
                                            tag.color = e.target.value;
                                            await pb
                                                .collection("tags")
                                                .update(tag.id, {
                                                    color: e.target.value,
                                                });
                                        }}
                                    /></label
                                >
                            </div>
                        {/if}
                    {/each}
                </div>
            {/if}
        {/if}
    </div>
    <div class="usergroup-area">
        <div>Usergroup:</div>
        <a
            class="usergroup-link"
            href="/#/usergroup/{card.expand?.board?.expand?.usergroup?.id}"
            >{card.expand?.board?.expand?.usergroup?.name}</a
        >

        {#if card.authors?.length}
            {#if card.authors.length > 1}
                <div>Authors:</div>
            {:else}
                <div>Author:</div>
            {/if}
            <div class="users-container">
                {#each card.authors as author}
                    {#if card.expand?.authors?.find((e) => e.id === author)}
                        <div class="userbox">
                            <div class="navavatar">
                                <img
                                    loading="lazy"
                                    src="{$server.url}/api/files/_pb_users_auth_/{card.expand.authors.find(
                                        (e) => e.id === author,
                                    ).id}/{card.expand.authors.find(
                                        (e) => e.id === author,
                                    ).avatar}?thumb=25x25"
                                />
                            </div>
                            {card.expand.authors.find((e) => e.id === author)
                                .name}
                        </div>
                    {:else}
                        <div class="userbox">
                            <div class="navavatar">
                                <img
                                    loading="lazy"
                                    src="{$server.url}/api/files/_pb_users_auth_/{$localToken
                                        ?.model?.id}/{$localToken?.model
                                        .avatar}?thumb=25x25"
                                />
                            </div>
                            {$localToken?.model.name}
                        </div>
                    {/if}
                {/each}
            </div>
        {/if}

        <div>Board:</div>
        <Boardcard board={card.expand?.board} workspacecard={true} />
    </div>

    <!-- {card.done} -->
    <div class:active={!!card.done} class="progress-bar">
        <div
            style="width:{card.done}%"
            class="progress {card.done == 100 ? `complete` : ``}"
        ></div>
    </div>

    <div class="card-container card-container---controls">
        <div class="controls editor-panel">
            {#if card.link != "" || card.imglink != "" || card.file != ""}
                <div class="feed-btn">
                    <a
                        target="_blank"
                        href={card.link
                            ? card.link
                            : card.imglink
                              ? card.imglink
                              : getFile(card).link}
                    >
                        📎
                    </a>
                </div>
            {/if}

            <button class="cardcontrols-move" on:click={handlemovetoBoard}
                >move ➜</button
            >
            <button class="cardcontrols-move" on:click={handleDuplicate}
                >duplicate</button
            >
            <!-- <a href="/#/board/{card.board}">current board</a> -->
            <button
                class="alert cardcontrols-delete"
                on:click={() => (showconfirmbox = true)}>delete</button
            >
            <button
                class="readmodetoggle"
                class:readmode
                on:click={() => {
                    readmode = !readmode;
                    editorblocked.set(readmode);
                    if (!readmode) {
                        setTimeout(() => {
                            document
                                .querySelector(".ProseMirror.editor")
                                ?.focus();
                        }, 200);
                    }
                }}
            >
                {#if readmode}
                    📝 edit
                {:else}
                    📄 view
                {/if}
            </button>
        </div>
    </div>
    <Confirmaction
        show={showconfirmbox}
        on:close={() => {
            showconfirmbox = false;
        }}
        on:confirm={() => {
            handleDelete();
        }}
    >
        Are you sure you want to delete this card?
    </Confirmaction>

    <!-- {#if card.logs}
                <div class="log-container">
                    {#if card.logs.length > 1}
                    {#each card.logs as log}
                        <div class:completed={log.includes("completed")} class="log">{log}</div>
                    {/each}
                    {/if}
    
                </div>
                {/if} -->
    <!-- {card.text} -->
    <slot />
</div>

<style>
    .progress-bar {
        max-width: 300px;
        background: var(--container-bg);
        height: 0px;
        border-radius: 7px;
        width: 100%;
        overflow: hidden;
        transition: all 0.5s;
        opacity: 0;
    }
    .progress-bar.active {
        height: 7px;
        opacity: 1;
    }
    .progress {
        height: 100%;
        width: 0%;
        background: var(--button-bg);
        transition: all 0.5s;
    }
    .complete {
        background: var(--complete);
    }
    .nodeco {
        text-decoration: none;
    }
    button,
    .btn {
        min-height: 26px;
    }

    .card {
        background-color: var(--card-bg);
        padding: 13px;
        width: 100%;
        display: block;
        justify-content: space-between;
        gap: 5px;
        box-sizing: border-box;
        position: relative;
        /* box-shadow: 2px 3px 4px #00000026; */
        /* border-radius: 4px; */
        height: 100%;
        /* display: grid; */
        grid-row: span 3;
        grid-column: span 3;
        grid-template-rows: subgrid;
        overflow: hidden;
        box-shadow: inset 18px 20px 14px -27px rgba(0, 0, 0, 0.12);
        font-size: 13px;
    }

    .card.listview {
        grid-template-rows: auto;
        grid-template-columns: subgrid;
        gap: 14px;
        min-height: 83px;
        max-width: 100%;
    }

    @container card-container (max-width: 768px) {
    }

    .card-container---controls {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
        z-index: 2;
    }

    .img-c {
        display: block;
    }
    .img-c object,
    .img-c img {
        width: auto;
        max-width: 100%;
        max-height: 200px;
    }

    .log-container {
        max-height: 100px;
        overflow: scroll;
        display: flex;
        flex-direction: column;
        margin-top: 20px;
    }
    .log {
        font-size: 1.2rem;
        opacity: 0.6;
        margin: 3px;
        padding: 3px;
        border-radius: 5px;
        display: flex;
        align-content: center;
        align-items: center;
        padding-left: 8px;
    }

    .completed {
        background: #008062;
        color: var(--button-color);
    }
    /* main{
        min-height:181px;
        height: 100%;
            width: 100%;
            display:contents;
    } */
    .tags {
        margin-top: 10px;
    }

    .thumb {
        /* min-height: 100px; */
        cursor: pointer;
    }

    .thumblink {
        display: block;
        width: 100%;
        /* min-height: 100px; */
    }

    .feed-btn a,
    .editor-panel a {
        background: var(--button-bg);
        color: var(--button-color);
        padding: 5px;
        font-weight: bold;
        font-size: 1.2rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 5px;
        text-decoration: none;
        min-height: 26px;
    }

    .feed-btn a:hover {
        text-decoration: none;
    }

    .title {
        font-weight: bold;
        color: var(--main-font-2);
        font-size: 2.9rem;
        margin-bottom: 5px;
    }
    .tags {
        font-size: 1.2rem;
        opacity: 0.8;
    }

    .tags a {
        display: inline-block;
        margin-right: 4px;
        border-radius: 5px;
        font-weight: bold;
        background: var(--header-bg);
        margin-bottom: 4px;
        padding: 3px 7px !important;
        color: white !important;
    }

    .link {
        font-size: 1rem;
        opacity: 0.6;
        margin-bottom: 1em;
        max-height: 36px;
        overflow: hidden;
    }

    .updates {
        font-size: 1.2rem;
        white-space: pre-wrap;
        overflow: hidden;
        max-height: 8ch;
    }

    .fullview .updates,
    .listview .updates {
        max-height: unset;
    }

    .tooltip {
        font-size: 1rem;
        color: var(--button-bg);
        padding: 14px;
        max-width: 100%;
        word-break: break-word;
        pointer-events: none;
        max-height: 180px;
        z-index: 2;
        opacity: 1;
        display: none;
    }

    .thumb .tooltip {
        opacity: 1;
    }

    @media only screen and (max-width: 991px) {
        .thumb a {
            pointer-events: none;
        }
    }

    .fullview.card {
        max-height: unset;
        max-width: 100%;
        width: 100%;
    }
    .fullview .img-c object,
    .fullview .img-c img {
        max-height: 800px;
        max-width: 100%;
    }

    .fullview .img-c object {
        width: 100%;
    }

    input {
        cursor: pointer;
    }
    .inputholder label {
        cursor: pointer;
        font-size: 1.2rem;
        opacity: 0.6;
    }
    .inputholder {
        background-color: transparent;
        /* transition:background-color .3s; */
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: center;
        max-width: 59px;
        border-radius: 7px;
        margin-bottom: 7px;
    }

    .inputholder label {
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: center;
        padding: 2px;
        gap: 4px;
        line-height: 0;
    }
    .checked {
        background-color: #008062;
    }

    .duedate,
    .date {
        margin-top: 7px;
        background: var(--board-title-color);
        color: var(--button-color);
        border-radius: 20px;
        padding: 2px 4px;
        width: fit-content;
    }

    .duedate.warning {
        background: #d9b45b;
        color: white;
    }
    .duedate.today {
        background: #f20e0e;
        color: white;
    }
    .duedate.done {
        background: var(--complete);
        color: var(--complete-col);
    }

    .duedate.passed {
        opacity: 0.4;
    }

    .inputholder input {
        margin: 0px;
    }

    .card.listview .date {
        position: absolute;

        right: 12px;
        bottom: 8px;
    }

    .card.listview .card-container---controls {
        align-items: flex-end;
        justify-content: end;
        position: absolute;
        bottom: 10px;
        right: 12px;
        display: none;
    }

    .listview .updates {
        max-width: 87%;
    }

    @media (max-width: 991px) {
        .feed-btn a,
        .editor-panel a {
            padding: 10px;
        }
    }

    .grabber {
        position: absolute;
        right: 15px;
        z-index: 2;
        right: 0;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        left: -5px;
        padding: 5px 0px;
        top: 0;
        padding-right: 5px;
    }

    @media (max-width: 991px) {
        .card:not(.fullview) {
            grid-template-rows: auto;
            grid-template-columns: subgrid;
            gap: 14px;
            min-height: 83px;
            max-width: 100%;
            grid-template-rows: auto;
            grid-template-columns: subgrid;
            gap: 14px;
            min-height: 83px;
            max-width: 100%;
            gap: 8px;
            min-height: 54px;
            padding: 5px;
        }

        .card:not(.fullview) .card-container---controls {
            grid-column: span 3;
        }

        .card:not(.fullview) .card-container---info {
            grid-column: span 2;
        }

        .card:not(.fullview) .thumb {
            max-height: 100px;
            overflow: hidden;
        }
        .card:not(.fullview) .updates {
            max-height: 20px;
        }

        .card:not(.fullview) .card-container---controls {
            position: absolute;
            bottom: 0;
            right: 10px;
        }
    }

    .usergroup-area {
        display: grid;
        gap: 13px;
        margin: 10px 0;
    }
    .usergroup-link {
        font-weight: bold;
        font-size: 1.6rem;
    }

    .userbox {
        display: flex;
        align-items: center;
        gap: 10px;
        background: var(--container-bg);
        overflow: hidden;
        border-radius: 9px;
        padding: 0 9px 0 0;
    }
    .navavatar {
        width: 25px;
        height: 25px;
        overflow: hidden;
    }
    .navavatar img {
        object-fit: contain;
        height: 25px;
    }
    .instancebox {
        background: var(--card-bg);
        padding: 16px;
        /* margin-bottom: 30px; */
        height: 100%;
    }
    .users-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .color {
        display: none;
    }
    label {
        cursor: pointer;
        background: var(--button-bg);
        color: var(--button-color);
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 4px;
        max-height: 21px;
    }
    .tagcolor-container {
        display: flex;
    }
</style>
