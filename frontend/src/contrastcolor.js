export default function (ogcolorhex, darkcolor = "#131313", lightcolor = "#e1e1e1", fallback = "#e1e1e1") {
    let r, g, b;

    // Check if the color is a valid hex format
    if (/^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/.test(ogcolorhex)) {
        ogcolorhex = ogcolorhex.replace(/^#/, ""); // Remove the # if present

        // Expand shorthand hex (e.g., #03F) to full form (e.g., 0033FF)
        if (ogcolorhex.length === 3) {
            ogcolorhex = ogcolorhex.split('').map(c => c + c).join('');
        }

        // Parse the hex values to RGB
        r = parseInt(ogcolorhex.substring(0, 2), 16);
        g = parseInt(ogcolorhex.substring(2, 4), 16);
        b = parseInt(ogcolorhex.substring(4, 6), 16);
    }
    // Check if the color is in RGB or RGBA format
    else if (/^rgba?\(/i.test(ogcolorhex)) {
        const rgbRegex = /^rgba?\(\s*([\d.]+)(%?)\s*,\s*([\d.]+)(%?)\s*,\s*([\d.]+)(%?)\s*(?:,\s*[\d.]+)?\s*\)$/i;
        const match = ogcolorhex.match(rgbRegex);

        if (!match) {
            return fallback; // Invalid RGB/A format
        }

        // Helper function to parse and convert RGB components
        const parseComponent = (valueStr, isPercent) => {
            let value = parseFloat(valueStr);
            if (isPercent) {
                value = (value * 255) / 100; // Convert percentage to 0-255
            }
            return Math.min(255, Math.max(0, value)); // Clamp to valid range
        };

        // Parse each component (R, G, B)
        r = parseComponent(match[1], match[2] === '%');
        g = parseComponent(match[3], match[4] === '%');
        b = parseComponent(match[5], match[6] === '%');
    } else {
        return fallback; // Unsupported format
    }

    // Calculate relative luminance using the WCAG formula
    const luminance = (r * 299 + g * 587 + b * 114) / 1000;

    // Determine the contrasting color based on luminance
    return luminance > 128 ? darkcolor : lightcolor;
}