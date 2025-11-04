<script>
    import * as d3 from "d3";

    export let data = [];
    export let margin = { top: 50, right: 50, bottom: 0, left: 30 };

    // Now using opacity mapping instead of colors
    export let opacities = [
        [0, 0.0],
        [1, 0.3],
        [2, 0.3],
        [3, 0.5],
        [5, 0.8],
        [6, 1],
    ];

    // Base color (can be customized)
    export let baseColor = "var(--createdon)";

    export let width = 748 - margin.left - margin.right;
    export let height = 142 - margin.top - margin.bottom;

    let chart;
    let tooltip = {
        left: 0,
        top: 0,
        data: null,
        visible: false,
    };

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const sanitize = ({ date, data, value }) => {
        const year = date.getFullYear();
        const onejan = new Date(year, 0, 1);
        let week = Math.ceil(
            ((date.getTime() - onejan.getTime()) / 86400000 +
                onejan.getDay() +
                1) /
                7,
        );

        if (date.getDay() === 6) week--;

        return {
            date,
            data,
            day: days[date.getDay()],
            week:
                week === 53 && new Date().getFullYear() !== year
                    ? `1_${year + 1}`
                    : `${week}_${year}`,
            value,
        };
    };

    $: if (data && opacities && chart) {
        const serialized = data.map(sanitize);
        const weeks = [...new Set(serialized.map((s) => s.week))];

        chart.innerHTML = "";

        const svg = d3
            .select(chart)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand().range([0, width]).domain(weeks).padding(0.18);
        const y = d3
            .scaleBand()
            .range([height, 0])
            .domain(days.slice().reverse())
            .padding(0.2);

        svg.append("g").call(d3.axisLeft(y).tickSize(0).tickPadding(6));

        const monthsLabel = weeks.map((w) => {
            const found = serialized.find(
                (s) => s.week === w && s.date.getDate() === 1,
            );
            if (found) return months[found.date.getMonth()];
            else return (Math.random() + 1).toString(36).substring(7);
        });

        const labels = d3
            .axisTop(d3.scaleBand().range([0, width]).domain(monthsLabel))
            .tickValues(monthsLabel.filter((d) => d.length === 3))
            .tickSize(0)
            .tickPadding(6);

        svg.append("g").attr("transform", `translate(0, 0)`).call(labels);

        // Opacity scale
        const domain = opacities.map((c) => c[0]);
        const range = opacities.map((c) => c[1]);
        const opacityScale = d3.scaleLinear().range(range).domain(domain);

        svg.selectAll()
            .data(serialized, (d) => d.week + ":" + d.day)
            .join("rect")
            .attr("rx", 2)
            .attr("ry", 2)
            .attr("x", (d) => x(d.week))
            .attr("y", (d) => y(d.day))
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", baseColor)
            .style("opacity", (d) => opacityScale(d.value))
            .on("mouseover", () => (tooltip.visible = true))
            .on("mousemove", (e, d) => {
                tooltip = {
                    left: e.pageX + 5,
                    top: e.pageY - 25,
                    data: d.data,
                    visible: true,
                };
            })
            .on("mouseleave", () => (tooltip.visible = false));
    }
</script>

<div
    class="fixed"
    class:visible={tooltip.visible}
    class:invisible={!tooltip.visible}
    style={`left: ${tooltip.left}px; top: ${tooltip.top}px`}
>
    {#if tooltip.data}
        <slot name="tooltip" data={tooltip.data} />
    {/if}
</div>

<div bind:this={chart} />

<style>
    .fixed {
        position: fixed;
        z-index: 1000;
    }

    .visible {
        visibility: visible;
    }

    .invisible {
        visibility: hidden;
    }
</style>
