export default (str) => {
    const emojiRegex = /\p{Extended_Pictographic}/u;
    const match = str.match(emojiRegex);

    if (match) {
        const index = str.indexOf(match[0]);
        const text =
            str.slice(0, index) + str.slice(index + match[0].length);
        return {
            emoji: match[0],
            text: text.trim(),
        };
    }

    return {
        emoji: null,
        text: str.trim(),
    };
};