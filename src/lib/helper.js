/**
 * Simple images preload
 *
 * @param {Array} urls - Array of urls
 */
export const preloadImages = (urls) => {
    urls.forEach((url) => {
        const image = new Image();
        image.src = url;
    });
};

/**
 * Decline russian words
 *
 * @param {Number} number
 * @param {Array} words - Array of 3 words (e.g. ['машина', 'машины', 'машин'])
 * @returns {String}
 */
export const declineWord = (number, words) => {
    let result = number + '&nbsp;';

    if (number % 10 === 1 && number % 100 !== 11) {
        result += words[0];
    } else if ([2, 3, 4].indexOf(number % 10) > -1 && [12, 13, 14].indexOf(number % 100) < 0) {
        result += words[1];
    } else {
        result += words[2];
    }

    return result;
};

/**
 * Format large numbers
 *
 * @param {Number} number
 * @param {String} string - String between thousands. Non-breaking space by default
 * @returns {String}
 */
export const formatNumber = (number, string = '&nbsp;') => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, string);

/**
 * Scroll window to target element
 *
 * @param {Element} element
 * @param {Number} offset - Offset from top screen edge
 */
export const scrollToElement = (element, offset = 0) => {
    const y = element.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - offset;

    console.log(y);

    window.scroll(0, y);

    // Uncomment when using native smooth scroll (or smoothscroll-polyfill)
    // window.scroll({ top: y, left: 0, behavior: 'smooth' });
};

/**
 * Copy given string to clipboard
 *
 * @param {String} string - String to copy
 * @returns {Promise}
 */
export const copyToClipboard = (string) => {
    const input = document.createElement('textarea');

    Object.assign(input.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        opacity: '0',
    });

    input.value = string;
    document.body.appendChild(input);
    input.select();

    return new Promise((resolve, reject) => {
        try {
            console.log(input);
            document.execCommand('copy');
            resolve(string);
        } catch (e) {
            reject();
        }

        document.body.removeChild(input);
    });
};

/**
 * Return random number in given range
 *
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
