import Config from '../config';

/**
 * Helper wrapper for pretty console messages
 * @param  {...any} args
 */
const log = (...args) => {
    console.log(`%c[${Config.name}]%c[Analytics]`, 'color: #19b5fe;', 'color: #f7ca18', ...args);
}

/**
 * Send analytics events via GTM
 *
 * @param {String} label - Event label
 * @param {String} action - Event action ("Click" by default)
 */
const sendEvent = (label, action = 'Click') => {
    const value = `${Config.analyticsCategory} — ${label} — ${action}`;

    log(value);

    if (window.dataLayer !== undefined && Config.analyticsCategory) {
        window.dataLayer.push({
            event: 'data_event',
            data_description: value,
        });
    }
};

/**
 * Send pageview event via GTM
 */
const sendPageView = () => {
    log('Page — View');

    if (window.dataLayer !== undefined) {
        window.dataLayer.push({
            event: 'Page — View',
            post_details: {},
            section: 'special',
            tags: [],
            title: document.title,
            url: window.location.pathname,
        });
    }
};

/**
 * Set analytics attributre for Osnova analytics
 * @param {Element} element
 */
const supportOsnova = (element) => {
    element.dataset.analytics = `${Config.analyticsCategory} — Container`;
};

export default {
    sendEvent,
    sendPageView,
    supportOsnova,
};
