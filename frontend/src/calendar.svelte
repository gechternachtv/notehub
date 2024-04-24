<script>
    import { Calendar } from "calendar-base";
    import { pb } from "./pb.js";
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
            fields: "id,created,title",
        });
        console.log(cards);
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
</script>

<div class="controls">
    <button on:click={monthsub}>←</button>
    <button on:click={monthadd}>→</button>
</div>
<div class="container">
    {months[month]} - {year}
    <div class="calendar">
        {#each weekdays as weekday}
            <div class="weekday">{weekday}</div>
        {/each}
        {#each calrows as day}
            <div class="day">
                {#if day}
                    <button
                        on:click={(e) => {
                            console.log(e);
                            dispatch("dayclick", {
                                day: fn(day.day),
                                month: fn(month + 1),
                                year: year,
                            });
                        }}
                    >
                        {day.day}
                        <!-- {`${year}-${fn(month + 1)}-${fn(day.day)}`} -->
                        {#each cards.filter((e) => e.created.includes(`${year}-${fn(month + 1)}-${fn(day.day)}`) || e.title.includes(`${fn(day.day)}-${fn(month + 1)}-${year}`)) as card}
                            .
                        {/each}
                    </button>
                {/if}
            </div>
        {/each}
    </div>
</div>

<style>
    .calendar {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    }
    .container {
        max-width: 430px;
        font-weight: bold;
        font-size: 12px;
    }
    .weekday {
        min-height: 30px;
    }
    .day {
        min-height: 30px;
    }
</style>
