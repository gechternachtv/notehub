<script>
    // @ts-nocheck

    // import { pb } from "../pb.js";
    // import Modal from "../modal/modal.svelte";
    import { createEventDispatcher } from "svelte";
    import dateFormat from "../dateFormat.js";
    import getFiles from "../getFiles.js";
    import { server } from "../stores.js";
    import contrastcolor from "../contrastcolor.js";

    // import Cardpage from "../Cardpage/cardpage.svelte";

    export let card = {
        id: "",
        check: "",
    };

    export let showcard = {
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

    export let workspace = null;
    //console.log(card);

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
    style={`grid-column: 1 / ${Object.values(showcard).filter((value) => value === true).length + 1}`}
    class="table-element"
>
    {#if showcard.shortcut}
        <div class="column nopadding">
            {#if card.id}
                <div class="tablecard_link">
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
                        ></a
                    >
                </div>
            {/if}
        </div>
    {/if}

    {#if showcard.id}
        <div class="column">
            {#if card.id}
                <div class="tablecard_id">
                    <a
                        style={card.color && card.color != "var(--card-bg)"
                            ? `background:${card.color};color:${contrastcolor(card.color, "#131313", "#e1e1e1", "var(--button-color)")}`
                            : ""}
                        href="/#/card/{card.id}{workspace?.name && workspace?.id
                            ? `?workspacename=${workspace?.name}&workspaceid=${workspace?.id}`
                            : ''}">{card.id}</a
                    >
                </div>
            {/if}
        </div>
    {/if}

    {#if showcard.img}
        <div class="column">
            {#if card.file || card.imglink}
                <div class="card-container card-container---image">
                    {#if card.file?.length}
                        {#if getFiles(card)[0].type === "image/jpeg"}
                            <a target="_blank" href={getFiles(card)[0].link}>
                                <img
                                    loading="lazy"
                                    src="{getFiles(card)[0].link}{getFiles(
                                        card,
                                    )[0].link.includes($server.url)
                                        ? `?thumb=100x100`
                                        : ''}"
                                    alt=""
                                />
                            </a>
                        {/if}
                    {:else if card.imglink}
                        <a target="_blank" href={card.imglink}>
                            <img
                                loading="lazy"
                                src="{card.imglink}{card.imglink.includes(
                                    $server.url,
                                )
                                    ? `?thumb=100x100`
                                    : ''}"
                                alt=""
                            />
                        </a>
                    {/if}
                </div>
            {/if}
        </div>
    {/if}

    {#if showcard.title}
        <div class="column titlecolumn">
            {#if card.title}
                {#if card.link}
                    {#if card.favico}
                        <a class="tablefavico" href={card.link}
                            ><img src={card.favico} alt="" />
                        </a>
                        <a href={card.link}>
                            <span class="tablecard_title">
                                {card.title}
                            </span></a
                        >
                    {:else}
                        <a class="tablelinkbtn" href={card.link}>📎</a>
                        <a href={card.link}>
                            <span class="tablecard_title">
                                {card.title}
                            </span></a
                        >
                    {/if}
                {:else}
                    <span class="tablecard_title">
                        {card.title}
                    </span>
                {/if}
            {/if}
        </div>
    {/if}

    {#if showcard.text}
        <div class="column">
            {#if card.text}
                <div class="tablecard_text">
                    {card.text}
                </div>
            {/if}
        </div>
    {/if}

    {#if showcard.usergroup}
        <div class="column nopadding">
            {#if card.expand?.board?.expand?.usergroup}
                <a
                    class="table-boardlink"
                    href="/#/usergroup/{card.expand?.board?.expand?.usergroup
                        .id}"
                >
                    {card.expand?.board?.expand?.usergroup.name}
                </a>
            {/if}
        </div>
    {/if}

    {#if showcard.board}
        <div class="column nopadding">
            {#if card.expand?.board}
                <a
                    class="table-boardlink"
                    style={`background-color:${card.expand?.board.color};color:${contrastcolor(card.expand?.board.color, "#131313", "#e1e1e1", "var(--card-bg)")}`}
                    href="/#/board/{card.expand?.board.id}"
                >
                    {card.expand?.board.name}
                </a>
            {/if}
        </div>
    {/if}

    {#if showcard.tags}
        <div class="column">
            {#if card.expand?.tags}
                {#if card.expand?.tags.length > 0}
                    <div class="tags">
                        {#each card.expand?.tags as tag}
                            {#if tag.name != undefined}
                                <a
                                    href="/#/search?tag={tag.id}&usergroup={tag.usergroup}"
                                    class="tag"
                                    style="background:{tag.color};"
                                    >{tag.name}</a
                                >
                            {/if}
                        {/each}
                    </div>
                {/if}
            {/if}
        </div>
    {/if}

    {#if showcard.created}
        <div class="column">
            {#if card.created}
                <div class="tablecard_created">
                    <div class="date">🗓️ {date}</div>
                </div>
            {/if}
        </div>
    {/if}

    {#if showcard.targetdate}
        <div class="column">
            {#if card.datementions}
                <div class="tablecard_targetdate">
                    <div class="duedate {duedate.status}">
                        📆 {dateFormat(duedate.date, false)}
                    </div>
                </div>
            {/if}
        </div>
    {/if}

    {#if showcard.progress}
        <div class="column">
            {#if card.done}
                <div class="tablecard_progress-bar">
                    <div class="progress-bar">
                        <div
                            style="width:{card.done}%"
                            class="progress {card.done == 100
                                ? `complete`
                                : ``}"
                        ></div>
                    </div>
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    /* .table-element {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        margin-bottom: 10px;
    } */
    .tablefavico img {
        max-width: 12px;
    }
    .tablelinkbtn {
        background: var(--button-bg);
        display: block;
        border-radius: 4px;
        padding: 4px;
    }
    .tablecard_link {
        width: 100%;
        height: 100%;
        text-align: center;
    }
    .tablecard_link a,
    .tablecard_fav .tablelinkbtn {
        background: var(--button-bg);
        display: block;
        border-radius: 0px;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .table-element {
        /* gap: 10px; */
        /* margin-bottom: 10px; */
        align-content: center;
        align-items: center;

        display: grid;
        grid-template-columns: subgrid;
        border: 1px solid #00000038;
        border-bottom: 0px;
        padding-left: 0px;
        scroll-margin-top: 49vh;
    }
    .column {
        height: 100%;
        border-left: 1px solid #00000038;
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
        padding: 0px 2px;
    }
    .column:first-of-type {
        border-left: 0px;
    }
    .table-element:nth-child(odd) {
        background-color: rgba(0, 0, 0, 0.116);
    }
    .duedate,
    .date,
    .tablecard_id > a {
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

    .tablecard_title {
        font-weight: bold;
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

    .tags {
        font-size: 1.2rem;
        opacity: 0.8;
    }

    .tags a {
        display: inline-block;
        margin-right: 3px;
        border-radius: 11px;
        font-weight: normal;
        background: var(--header-bg);
        /*! margin-bottom:4px; */
        padding: 3px 5px !important;
        color: white !important;
        font-size: 10px;
    }

    .card-container---image img {
        width: 35px;
        height: 35px;
        object-fit: contain;
    }
    .progress-bar,
    .tablecard_progress-bar {
        width: 100%;
        min-width: 26px;
    }

    .nopadding {
        padding: 0px;
    }

    .table-boardlink {
        width: 100%;
        height: 100%;
        text-align: center;
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
    }
</style>
