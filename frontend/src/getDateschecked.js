export default function (dates) {
    try {
        return dates.map((dateStr) => {
            const datemepart = dateStr.split(":");

            let dateObj = null;

            if (datemepart.length === 1) {
                //dd-mm-yyyy
                const dayspart = datemepart[0].split("-");
                if (dayspart.length === 3) {
                    const [day, month, year] = dayspart.map(Number);
                    dateObj = new Date(year, month - 1, day, 0, 0); // default to midnight
                }
            } else if (datemepart.length === 3) {
                //dd-mm-yyyy:HH:MM
                const [datePart, hourStr, minuteStr] = datemepart;
                const dayspart = datePart.split("-");
                if (dayspart.length === 3) {
                    const [day, month, year] = dayspart.map(Number);
                    const hour = Number(hourStr);
                    const minute = Number(minuteStr);
                    dateObj = new Date(year, month - 1, day, hour, minute);
                }
            }

            return { dateStr, dateObj };
        });
    } catch (error) {
        console.warn(error)
    }

}