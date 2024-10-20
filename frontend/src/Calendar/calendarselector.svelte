<script>
    import { Calendar } from "calendar-base";
    import { pb } from "../pb.js";
    import { createEventDispatcher } from "svelte";
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
    const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    const cal = new Calendar({ siblingMonths: false, weekStart: true });

    const today = new Date();
    let year = today.getUTCFullYear();
    let month = today.getUTCMonth();
    let calrows = cal.getCalendar(year, month);

    $: {
        calrows = cal.getCalendar(year, month);
    }
    console.log(calrows);

    let cards = [];
    (async () => {
        cards = await pb.collection("cards").getFullList({
            sort: "-created",
            fields: "created,title",
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
    </div>

    <div class="calendar">
        {#each weekdays as weekday}
            <div class="weekday">{weekday}</div>
        {/each}
        {#each calrows as day}
            <div class="day">
                {#if day}
                    {#if !!cards.filter((e) => e.created.includes(`${year}-${fn(month + 1)}-${fn(day.day)}`) || e.title.includes(`${fn(day.day)}-${fn(month + 1)}-${year}`)).length}
                        <button
                            class="cardday"
                            class:today={day.day === new Date().getDate() &&
                                month === new Date().getUTCMonth() &&
                                year === new Date().getUTCFullYear()}
                            on:click={(e) => {
                                console.log(e);
                                dispatch("dayclick", {
                                    day: fn(day.day),
                                    month: fn(month + 1),
                                    year: year,
                                });
                            }}>{day.day}</button
                        >
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
        /* margin: auto; */
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
</style>
