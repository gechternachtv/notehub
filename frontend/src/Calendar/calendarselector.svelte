<script>
    import { Calendar } from "calendar-base";
    import { pb } from "../pb.js";
    import { createEventDispatcher } from "svelte";
    import { localToken } from "../stores.js";

    const dispatch = createEventDispatcher();

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
    console.log(calrows);

    let cards = [];
    (async () => {
        cards = await pb.collection("cards").getFullList({
            sort: "-created",
            fields: "created,datementions",
            filter: `(board.usergroup.users ~ "${$localToken.model.id}" || board.usergroup.public = "global-view")`,
        });
        console.log(cards);

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
        <div class="controls">
            <button on:click={monthsub}>←</button>
            <button on:click={monthadd}>→</button>
        </div>
        <div class="year">{year}</div>
        <div class="month">{months[month]}</div>
        <div class="current-day">{currentday}</div>
    </div>

    <div class="calendar">
        {#each weekdays as weekday}
            <div class="weekday">{weekday}</div>
        {/each}
        {#each calrows as day}
            <div class="day">
                {#if day}
                    {#if !!cards.filter((e) => e.created.includes(`${year}-${fn(month + 1)}-${fn(day.day)}`) || e.datementions.includes(`${fn(day.day)}-${fn(month + 1)}-${year}`)).length}
                        <button
                            class="cardday"
                            class:today={day.day === new Date().getDate() &&
                                month === new Date().getUTCMonth() &&
                                year === new Date().getUTCFullYear()}
                            class:active={currentday == fn(day.day) &&
                                currentmonth == fn(day.month) &&
                                currentyear == fn(day.year)}
                            on:click={(e) => {
                                console.log(fn(day.day));
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
                                {#if cards.filter( (e) => e.created.includes(`${year}-${fn(month + 1)}-${fn(day.day)}`), ).length > 1}
                                    <div class="day-createdon"></div>
                                    <div class="day-createdon"></div>
                                {:else if cards.filter( (e) => e.created.includes(`${year}-${fn(month + 1)}-${fn(day.day)}`), ).length > 0}
                                    <div class="day-createdon"></div>
                                {/if}

                                {#if cards.filter( (e) => e.datementions.includes(`${fn(day.day)}-${fn(month + 1)}-${year}`), ).length > 1}
                                    <div class="day-mentions"></div>
                                    <div class="day-mentions"></div>
                                {:else if cards.filter( (e) => e.datementions.includes(`${fn(day.day)}-${fn(month + 1)}-${year}`), ).length > 0}
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
                        <div
                            class:today={day.day === new Date().getDate() &&
                                month === new Date().getUTCMonth() &&
                                year === new Date().getUTCFullYear()}
                            class="nocardday"
                        >
                            {day.day}
                        </div>
                    {/if}

                    <!-- {`${year}-${fn(month + 1)}-${fn(day.day)}`} -->
                {/if}
            </div>
        {/each}
    </div>
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
        font-size: 12px;
        margin: auto;
        margin-bottom: 30px;
        min-height: 280px;
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
        font-size: 30px;
    }

    .month {
        font-size: 18px;
    }

    .header {
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
        background: var(--button-bg);
        width: 4px;
        height: 4px;
        border-radius: 10px;
        bottom: 0px;
    }

    .day-createdon {
        background: var(--main-font-2);
    }

    button {
        background: transparent;
        color: var(--main-font-1);
        transition: all 0.2s;
    }

    button:hover,
    button.active {
        background: var(--button-bg);
        color: var(--button-color);
    }

    button:hover .day-mentions,
    button:hover .day-createdon,
    button.active .day-mentions,
    button.active .day-createdon {
        background: var(--button-color);
    }

    .nocardday {
        opacity: 0.5;
    }
</style>
