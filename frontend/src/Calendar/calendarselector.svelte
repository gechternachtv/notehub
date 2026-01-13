<script>
    import { Calendar } from "calendar-base";
    import { pb } from "../pb.js";
    import { createEventDispatcher } from "svelte";
    import { localToken } from "../stores.js";

    const dispatch = createEventDispatcher();
    let showmentions = true;
    let showcreated = true;
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const cal = new Calendar({ siblingMonths: false, weekStart: 0 });

    const today = new Date();
    let year = today.getUTCFullYear();
    let month = today.getUTCMonth();
    let calrows = cal.getCalendar(year, month);
    let currentday = today.getDate();
    let currentmonth = month;
    let currentyear = year;

    $: {
        calrows = cal.getCalendar(year, month);
    }
    // console.log(calrows);

    let cards = [];
    (async () => {
        cards = await pb.collection("cards").getFullList({
            sort: "-created",
            fields: "created,datementions",
            filter: `(board.usergroup.users ~ "${$localToken.model.id}" || board.usergroup.public = "global-view")`,
        });
        // console.log(cards);

        dispatch("dayclick", {
            day: today.getDate(),
            month: month + 1,
            year: year,
        });
    })();

    const monthadd = () => {
        if (month != 11) {
            month = month + 1;
        } else {
            month = 0;
            year = year + 1;
        }
    };
    const monthsub = () => {
        if (month != 0) {
            month = month - 1;
        } else {
            month = 11;
            year = year - 1;
        }
    };

    const fn = (n) => {
        return n >= 10 ? n : `0${n}`;
    };

    const returncards = (day) => {};
</script>

<div class="container">
    <div class="header">
        <div class="header-date">
            <div class="year">{year}</div>
            <div class="month">{months[month]}</div>
            <div class="current-day">{currentday}</div>
        </div>
        <div class="controls">
            <button on:click={monthsub}>←</button>
            <button on:click={monthadd}>→</button>
        </div>
    </div>

    <div class="calendar">
        {#each weekdays as weekday}
            <div class="weekday">{weekday}</div>
        {/each}
        {#each calrows as day}
            <div class="day">
                {#if day}
                    {#if cards.filter((e) => (showcreated && e.created.includes(`${year}-${fn(month + 1)}-${fn(day.day)}`)) || (showmentions && e.datementions.includes(`${fn(day.day)}-${fn(month + 1)}-${year}`))).length}
                        <button
                            class="cardday"
                            class:today={day.day === new Date().getDate() &&
                                month === new Date().getUTCMonth() &&
                                year === new Date().getUTCFullYear()}
                            class:active={currentday == fn(day.day) &&
                                currentmonth == fn(day.month) &&
                                currentyear == fn(day.year)}
                            on:click={(e) => {
                                // console.log(fn(day.day));
                                currentday = day.day;
                                currentmonth = day.month;
                                currentyear = day.year;
                                dispatch("dayclick", {
                                    day: fn(day.day),
                                    month: fn(month + 1),
                                    year: year,
                                });
                            }}
                        >
                            <div class="daytag-container">
                                {#if showcreated && cards.filter( (e) => e.created.includes(`${year}-${fn(month + 1)}-${fn(day.day)}`), ).length > 1}
                                    <div class="day-createdon"></div>
                                    <div class="day-createdon"></div>
                                {:else if showcreated && cards.filter( (e) => e.created.includes(`${year}-${fn(month + 1)}-${fn(day.day)}`), ).length > 0}
                                    <div class="day-createdon"></div>
                                {/if}

                                {#if showmentions && cards.filter( (e) => e.datementions.includes(`${fn(day.day)}-${fn(month + 1)}-${year}`), ).length > 1}
                                    <div class="day-mentions"></div>
                                    <div class="day-mentions"></div>
                                {:else if showmentions && cards.filter( (e) => e.datementions.includes(`${fn(day.day)}-${fn(month + 1)}-${year}`), ).length > 0}
                                    <div class="day-mentions"></div>
                                {/if}
                            </div>
                            <!-- {#if !!cards.filter( (e) => e.created.includes(`${year}-${fn(month + 1)}-${fn(day.day)}`), )}
                                c
                            {/if}
                            {#if !!cards.filter( (e) => e.datementions.includes(`${fn(day.day)}-${fn(month + 1)}-${year}`), )}
                                m
                            {/if} -->
                            {day.day}
                        </button>
                    {:else}
                        <button
                            class:today={day.day === new Date().getDate() &&
                                month === new Date().getUTCMonth() &&
                                year === new Date().getUTCFullYear()}
                            class="nocardday"
                            on:click={(e) => {
                                // console.log(fn(day.day));
                                currentday = day.day;
                                currentmonth = day.month;
                                currentyear = day.year;
                                dispatch("newday", {
                                    day: fn(day.day),
                                    month: fn(month + 1),
                                    year: year,
                                });
                            }}
                        >
                            {day.day}
                        </button>
                    {/if}

                    <!-- {`${year}-${fn(month + 1)}-${fn(day.day)}`} -->
                {/if}
            </div>
        {/each}
    </div>
</div>
<div class="controls">
    <button
        on:click={() => {
            showcreated = !showcreated;
            dispatch("filterchange", {
                showcreated: showcreated,
                showmentions: showmentions,
            });
        }}
        class="minibutton"
    >
        {#if showcreated}
            <svg
                width="12px"
                height="12px"
                viewBox="0 0 36 36"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                class="iconify iconify--twemoji"
                preserveAspectRatio="xMidYMid meet"
                ><path
                    fill="var(--mentions)"
                    d="M36 32a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v28z"
                /><path
                    fill="#FFF"
                    d="M29.28 6.362a2.502 2.502 0 0 0-3.458.736L14.936 23.877l-5.029-4.65a2.5 2.5 0 1 0-3.394 3.671l7.209 6.666c.48.445 1.09.665 1.696.665c.673 0 1.534-.282 2.099-1.139c.332-.506 12.5-19.27 12.5-19.27a2.5 2.5 0 0 0-.737-3.458z"
                /></svg
            >
        {/if}
        created on</button
    >
    <button
        on:click={() => {
            showmentions = !showmentions;
            dispatch("filterchange", {
                showcreated: showcreated,
                showmentions: showmentions,
            });
        }}
        class="minibutton"
    >
        {#if showmentions}
            <svg
                width="12px"
                height="12px"
                viewBox="0 0 36 36"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                class="iconify iconify--twemoji"
                preserveAspectRatio="xMidYMid meet"
                ><path
                    fill="var(--mentions)"
                    d="M36 32a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v28z"
                /><path
                    fill="#FFF"
                    d="M29.28 6.362a2.502 2.502 0 0 0-3.458.736L14.936 23.877l-5.029-4.65a2.5 2.5 0 1 0-3.394 3.671l7.209 6.666c.48.445 1.09.665 1.696.665c.673 0 1.534-.282 2.099-1.139c.332-.506 12.5-19.27 12.5-19.27a2.5 2.5 0 0 0-.737-3.458z"
                /></svg
            >
        {/if}
        mentions</button
    >
</div>

<style>
    .calendar {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        gap: 1px;
    }
    .container {
        max-width: 300px;
        font-weight: bold;
        font-size: 1.2rem;
        margin: auto;
        margin-bottom: 17px;
        width: 100%;
        height: 100%;
        /* min-height: 280px; */
    }
    .weekday {
        min-height: 30px;
    }
    .day,
    .weekday {
        min-height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 2px solid transparent;
        border: 1px solid #0000000d;
    }

    .cardday,
    .nocardday {
        border-radius: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        border-bottom: 2px solid transparent;
        height: 100%;
        align-items: center;
        position: relative;
    }

    .year {
        font-size: 3rem;
    }

    .month {
        font-size: 1.8rem;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }
    .header-date {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .today {
        border-bottom: 2px solid var(--alert);
    }

    .daytag-container {
        position: absolute;
        display: flex;
        gap: 3px;
        bottom: 1px;
    }
    .day-mentions,
    .day-createdon {
        background: var(--mentions);
        width: 4px;
        height: 4px;
        border-radius: 10px;
        bottom: 0px;
    }

    .day-createdon {
        background: var(--createdon);
    }

    .calendar button {
        background: transparent;
        color: var(--main-font-1);
        transition: all 0.2s;
    }

    .calendar button:hover,
    .calendar button.active {
        background: var(--button-bg);
        color: var(--button-color);
    }

    .calendar button:hover .day-mentions,
    .calendar button:hover .day-createdon,
    .calendar button.active .day-mentions,
    .calendar button.active .day-createdon {
        background: var(--button-color);
    }

    .nocardday {
        opacity: 0.5;
    }
</style>
