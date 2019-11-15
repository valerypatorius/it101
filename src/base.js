import Config from './config';
import Analytics from './lib/analytics';

/**
 * Base special constructor with common methods
 */
class BaseSpecial {
    constructor(params) {
        this.params = {
            container: document.body,
        };

        Object.assign(this.params, Config, params);
        this.container = this.params.container;

        this.loadCSS(this.params.css).then(this.onCSSReady.bind(this));
    }

    /**
     * When CSS is loaded, attach event listeners and call init method
     */
    onCSSReady() {
        Analytics.supportOsnova(this.container);

        if (Config.sendPageView) {
            Analytics.sendPageView();
        }

        this.addEventsListeners();

        if (typeof this.init === 'function') {
            this.init();
        }
    }

    /**
     * Load CSS file
     *
     * @param {String} url
     */
    loadCSS(url) {
        return new Promise((resolve, reject) => {
            if (!url) {
                resolve();
                return;
            }

            const link = document.createElement('link');

            link.rel = 'stylesheet';
            link.href = url;

            link.onload = () => resolve();
            link.onerror = () => reject();

            document.body.appendChild(link);
        });
    }

    /**
     * Add events listeners to container
     */
    addEventsListeners() {
        this.params.listenedEvents.forEach((eventName) => {
            this.container.addEventListener(eventName, event => this.defaultEventHandler(event, eventName));
        });
    }

    /**
     * Default event listener
     *
     * @param {Event} event
     * @param {String} eventName
     */
    defaultEventHandler(event, eventName) {
        let { target } = event;
        let action = null;
        let canCallAction = true;

        while (target.parentNode && target !== event.currentTarget) {
            action = target.dataset[eventName];

            /** Send all links clicks to analytics */
            if (eventName === 'click' && target.tagName.toLowerCase() === 'a') {
                Analytics.sendEvent(target.href);
            }

            if (action) break;
            target = target.parentNode;
        }

        action = target.dataset[eventName];

        if (['mouseover', 'mouseout'].includes(eventName)) {
            const { relatedTarget } = event;

            canCallAction = false;

            if (relatedTarget && target !== relatedTarget && !target.contains(relatedTarget)) {
                canCallAction = true;
            }
        }

        if (canCallAction && action && this[action]) {
            this[action](target, event);
        }
    }
}

export default BaseSpecial;
