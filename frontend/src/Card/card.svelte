<script>
    // @ts-nocheck

    // import { pb } from "../pb.js";
    // import Modal from "../modal/modal.svelte";
    import { createEventDispatcher } from "svelte";
    import dateFormat from "../dateFormat.js";
    import getFiles from "../getFiles.js";

    // import Cardpage from "../Cardpage/cardpage.svelte";

    export let card = {
        id: "",
        check: "",
    };

    export let workspace;
    console.log(card);

    // let showModal = false;

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

    let date;

    let duedate;

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

    const dispatch = createEventDispatcher();
    const setInfo = (card) => {
        // checked = card.check === "done";
        date = dateFormat(new Date(card.created));
    };
    window.scrollTo(0, 0);

    const linkPreview = (c) => {
        const icon = c.link
            ? "🔗 "
            : c.imglink
              ? "🔗 "
              : c.file?.length
                ? getFiles(c)[0].type === "image/jpeg"
                    ? "🖼️"
                    : getFiles(c)[0].type === "Video"
                      ? "🎞️"
                      : getFiles(c)[0].type === "Audio"
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

    // let checked = card.check === "done";
    // const handleCheckbox = async () => {
    //     //console.log("checkboxed");
    //     // const record = await pb
    //     //     .collection("cards")
    //     //     .update(card.id, {
    //     //         ...card,
    //     //         check: checked ? "done" : "islist",
    //     //         logs: [
    //     //             ...card.logs,
    //     //             `card marked as ${checked ? "completed" : "incomplete"} at ${dateFormat(new Date())}`,
    //     //         ],
    //     //     });
    //     // card = record;
    //     // setInfo(card);
    //     // dispatch("updatefront", card);
    // };
    // const handlemovetoBoard = async ()=>{ //console.log("hey")}

    setInfo(card);

    // //console.log(getFile(card))
</script>

<div
    id={card.id}
    class="card"
    class:noimage={!card.file.length && !card.imglink}
>
    <div
        style="border-left: 5px solid {card.color
            ? card.color
            : 'var(--card-bg)'}"
        class="border-left"
    ></div>
    <!-- {card.board}<br/>
        {card.expand?.board.name} -->

    <!-- {card.board} -->
    <!-- <object title="stealth_operation_8VgOQaQdlq.mp3" data="{card.img}">Cannot preview the file.</object> -->

    <!-- {#if showModal}
        <Modal bind:showModal>
            <Cardpage params={{ id: card.id }}></Cardpage>
        </Modal>
    {/if} -->

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
            <span class="debug debug-id">{card.id}</span>
        </div>
        <a
            class="img-c thumblink"
            href="/#/card/{card.id}{workspace?.name && workspace?.id
                ? `?workspacename=${workspace?.name}&workspaceid=${workspace?.id}`
                : ''}"
        >
            <div class="thumb">
                <!-- {#if channel.thumb} -->
                <!-- <img loading=lazy src="{channel.thumb}" alt=""> -->

                {#if card.file?.length}
                    {#if getFiles(card)[0].type === "image/jpeg"}
                        <img
                            loading="lazy"
                            src={getFiles(card)[0].link}
                            alt=""
                        />
                    {/if}
                {:else if card.imglink}
                    <img loading="lazy" src={card.imglink} alt="" />
                {/if}

                <!-- {/if} -->
            </div>
        </a>
    </div>
    <div class="card-container card-container---info">
        <!-- <div class="title">{channel.name}</div> -->
        <!-- <div class="hostName">{channel.host}</div> -->
        <a
            class="nodeco"
            href="/#/card/{card.id}{workspace?.name && workspace?.id
                ? `?workspacename=${workspace?.name}&workspaceid=${workspace?.id}`
                : ''}"
        >
            {#if card.title}
                <div class="title">
                    {#if card.favico}
                        <img
                            style="max-width:16px"
                            loading="lazy"
                            src={card.favico}
                            alt=""
                        />
                    {/if}

                    {card.title}
                </div>
            {/if}

            <div class="link">
                {#if !card.title}
                    {#if card.favico}
                        <img
                            style="max-width:16px"
                            loading="lazy"
                            src={card.favico}
                            alt=""
                        />
                    {/if}
                {/if}

                {linkPreview(card)}
            </div>
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

        <a
            class="nodeco"
            href="/#/card/{card.id}{workspace?.name && workspace?.id
                ? `?workspacename=${workspace?.name}&workspaceid=${workspace?.id}`
                : ''}"
        >
            <div class="updates">{card.text}</div>
        </a>

        {#if card.expand?.tags}
            {#if card.expand?.tags.length > 0}
                <div class="tags">
                    {#each card.expand?.tags as tag}
                        {#if tag.name != undefined}
                            <a
                                href="/#/search?tag={tag.id}&usergroup={tag.usergroup}"
                                class="tag"
                                style="background:{tag.color};">{tag.name}</a
                            >
                        {/if}
                    {/each}
                </div>
            {/if}
        {:else if card.tags}
            {#if card.tags.length > 0}
                <div class="tags">
                    {#each card.tags as tag}
                        {#if tag.name != undefined}
                            <a
                                href="/#/search?tag={tag.id}&usergroup={tag.usergroup}"
                                class="tag"
                                style="background:{tag.color};">{tag.name}</a
                            >
                        {/if}
                    {/each}
                </div>
            {/if}
        {/if}

        <div class="date">🗓️ {date}</div>
        {#if card.datementions}
            {#if card.datementions.split(",").length > 0}
                <div class="duedate {duedate.status}">
                    📆 {dateFormat(duedate.date, false)}
                </div>
            {/if}
        {/if}
    </div>
    {#if card.done}
        <div class="progress-bar">
            <div
                style="width:{card.done}%"
                class="progress {card.done == 100 ? `complete` : ``}"
            ></div>
        </div>
    {/if}
    <div class="card-container card-container---controls">
        <div class="controls editor-panel">
            {#if card.link != "" || card.imglink != "" || card.file.length}
                <div class="feed-btn">
                    <a
                        target="_blank"
                        href={card.link
                            ? card.link
                            : card.imglink
                              ? card.imglink
                              : getFiles(card)[0].link}
                    >
                        📎
                    </a>
                </div>
            {/if}
            <div class="feed-btn">
                <a
                    href="/#/card/{card.id}{workspace?.name && workspace?.id
                        ? `?workspacename=${workspace?.name}&workspaceid=${workspace?.id}`
                        : ''}"
                >
                    <svg
                        fill="var(--button-color)"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        width="15px"
                        height="15px"
                        ><path
                            d="M 41.470703 4.9863281 A 1.50015 1.50015 0 0 0 41.308594 5 L 27.5 5 A 1.50015 1.50015 0 1 0 27.5 8 L 37.878906 8 L 22.439453 23.439453 A 1.50015 1.50015 0 1 0 24.560547 25.560547 L 40 10.121094 L 40 20.5 A 1.50015 1.50015 0 1 0 43 20.5 L 43 6.6894531 A 1.50015 1.50015 0 0 0 41.470703 4.9863281 z M 12.5 8 C 8.3754991 8 5 11.375499 5 15.5 L 5 35.5 C 5 39.624501 8.3754991 43 12.5 43 L 32.5 43 C 36.624501 43 40 39.624501 40 35.5 L 40 25.5 A 1.50015 1.50015 0 1 0 37 25.5 L 37 35.5 C 37 38.003499 35.003499 40 32.5 40 L 12.5 40 C 9.9965009 40 8 38.003499 8 35.5 L 8 15.5 C 8 12.996501 9.9965009 11 12.5 11 L 22.5 11 A 1.50015 1.50015 0 1 0 22.5 8 L 12.5 8 z"
                        /></svg
                    >
                </a>
            </div>
            <!-- <button on:click={() => (showModal = !showModal)}>view</button> -->

            <!-- <a href="/#/card/{card.id}">more</a> -->
        </div>
    </div>
</div>

<style>
    .border-left {
        position: absolute;
        top: 0px;
        left: 0px;
        height: 100%;
        pointer-events: none;
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

    .progress-bar {
        max-width: 100%;
        background: var(--container-bg);
        height: 4px;
        border-radius: 7px;
        width: 100%;
        overflow: hidden;
        transition: all 0.5s;
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
        display: grid;
        justify-content: space-between;
        gap: 5px;
        box-sizing: border-box;
        position: relative;
        /* box-shadow: 2px 3px 4px #00000026; */
        /* border-radius: 4px; */
        height: 100%;
        display: grid;
        grid-row: span 3;
        grid-column: span 3;
        /* grid-template-rows: subgrid; */
        overflow: hidden;
        box-shadow: inset 18px 20px 14px -27px rgba(0, 0, 0, 0.12);
        transition: all 0.5s;
        border: 1px solid var(--card-border);
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
        height: 100%;
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
        font-size: 1.2rem;
        margin-bottom: 5px;
    }
    .tags {
        font-size: 1rem;
        opacity: 0.8;
    }

    .tags a {
        display: inline-block;
        margin-right: 4px;
        border-radius: 5px;
        font-weight: bold;
        background: var(--header-bg);
        margin-bottom: 4px;
        padding: 1px 7px !important;
        color: white !important;
    }

    .link {
        font-size: 1rem;
        opacity: 0.6;
        margin-bottom: 1em;
        max-height: 36px;
        overflow: hidden;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
    }

    .updates {
        font-size: 1.2rem;
        white-space: normal;
        overflow: hidden;
        max-height: 8ch;
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

    .date {
        /* font-size: 1.2rem; */
        opacity: 0.7;
        /* margin-top: 17px; */
    }

    .inputholder input {
        margin: 0px;
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
        .feed-btn a,
        .editor-panel a {
            padding: 10px;
        }
        .thumb a {
            pointer-events: none;
        }
        .card:not(.fullview) {
            grid-template-rows: auto;
            grid-template-columns: subgrid;
            gap: 14px;
            min-height: 83px;
            max-width: 100%;
            grid-template-rows: auto;
            /* grid-template-columns: subgrid; */
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
            max-height: 29px;
        }

        .card:not(.fullview) .card-container---controls {
            position: absolute;
            bottom: 0;
            right: 10px;
        }
        .updates {
            color: var(--main-font-1);
        }

        .editor-panel {
            display: none;
        }
    }

    .title {
        display: flex;
        align-content: center;
        align-items: center;
        gap: 5px;
        justify-content: flex-start;
    }
</style>
