<script>
    import CalendarHeatmap from "./cal-heatmap.svelte";
    import { pb } from "../pb.js";
    import { localToken } from "../stores.js";

    let cards = [];
    let data = [];

    (async () => {
        cards = await pb.collection("cards").getFullList({
            sort: "-created",
            fields: "created,datementions",
            filter: `(board.usergroup.users ~ "${$localToken.model.id}" || board.usergroup.public = "global-view")`,
        });

        // --- Collect all card dates (can repeat) ---
        const allDates = [];

        for (const card of cards) {
            // created date (ISO format)
            const created = new Date(card.created);
            allDates.push(created.toISOString().split("T")[0]);

            // datementions (can be empty or comma-separated)
            if (card.datementions && card.datementions.trim()) {
                for (const raw of card.datementions.split(",")) {
                    const [d, m, y] = raw.trim().split("-");
                    if (y && m && d) {
                        const parsed = new Date(`${y}-${m}-${d}T00:00:00Z`);
                        // if (!isNaN(parsed))
                        allDates.push(parsed.toISOString().split("T")[0]);
                    }
                }
            }
        }

        // --- Generate a 365-day range ending today ---
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 364);

        const fullRange = [];
        for (let i = 0; i < 365; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            fullRange.push(d);
        }

        // --- Count occurrences for each date ---
        data = fullRange.map((date) => {
            const iso = date.toISOString().split("T")[0];
            const value = allDates.filter((ds) => ds === iso).length;
            return {
                date,
                value,
                data: { date, value },
            };
        });

        console.log(data);
    })();
</script>

<main>
    {#if data}
        <CalendarHeatmap {data}>
            <span slot="tooltip" let:data={d} class="tooltip">
                {d.date.toDateString()} - <b>{d.value}</b> (-{d.reversed})
            </span>
        </CalendarHeatmap>
    {/if}
</main>

<style>
    main {
        background: var(--card-bg);
    }
    .tooltip {
        padding: 3px 10px;
        display: block;
        border-radius: 10px;
        background-color: var(--button-bg);
        background: var(--button-bg);
        color: var(--button-color);
        padding: 4px;
    }
</style>
