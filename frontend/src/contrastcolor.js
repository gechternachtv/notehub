export default function (ogcolorhex, darkcolor = "#131313", lightcolor = "#e1e1e1", fallback = "#e1e1e1") {

    if (/^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/.test(ogcolorhex)) {
        ogcolorhex = ogcolorhex.replace(/^#/, ""); // Remove # if present


        if (ogcolorhex.length === 3) {
            ogcolorhex = ogcolorhex
                .split("")
                .map((char) => char + char)
                .join("");
        }

        // Convert to RGB
        let r = parseInt(ogcolorhex.substring(0, 2), 16);
        let g = parseInt(ogcolorhex.substring(2, 4), 16);
        let b = parseInt(ogcolorhex.substring(4, 6), 16);

        // Calculate relative luminance (per WCAG formula)
        let luminance = (r * 299 + g * 587 + b * 114) / 1000;

        // Return black for light colors, white for dark colors
        return luminance > 128 ? darkcolor : lightcolor;
    } else {
        return fallback
    }


}