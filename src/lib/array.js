/**
 * Find most frequent value in array
 *
 * @param {Array} array
 * @returns {*}
 */
export const getMostFrequentValue = (array) => {
    const result = [...array];

    return result.sort((a, b) => result.filter(v => v === a).length - result.filter(v => v === b).length).pop();
};

/**
 * Shuffle an array (original array is modified)
 *
 * @param {Array} array
 */
export const shuffle = (array) => {
    let j;
    let x;
    let i;

    for (i = array.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
};

/**
 * Convert nodelist to array
 *
 * @param {NodeList} nodeList
 * @returns {Array}
 */
export const toArray = nodeList => Array.prototype.slice.call(nodeList);
