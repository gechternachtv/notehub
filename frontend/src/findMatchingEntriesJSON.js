export default function findMatchingEntries(obj, matchFn, results = [], parent = null, keyInParent = null) {
    for (const key in obj) {
        const value = obj[key];

        if (matchFn(value)) {
            results.push({
                key,
                value,
                parent: obj,      // Reference to parent
                keyInParent: key  // Key to use for mutation
            });
        }

        if (value && typeof value === 'object') {
            findMatchingEntries(value, matchFn, results, obj, key);
        }
    }
    return results;
}
