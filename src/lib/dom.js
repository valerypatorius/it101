/**
 * Make html element with given properties
 *
 * @param {String} tagName
 * @param {Array|String} classNames - Array of classnames or single classname string
 * @param {Object} attributes - Object with html attributes
 * @returns {Element}
 */
export const makeElement = (tagName, classNames = [], attributes = []) => {
    tagName = tagName.toLowerCase();

    const element = document.createElement(tagName);

    if (classNames) {
        if (typeof classNames === 'object') {
            classNames.forEach((cname) => {
                element.classList.add(cname);
            });
        } else if (typeof classNames === 'string') {
            element.classList.add(classNames);
        }
    }

    const attributesKeys = Object.keys(attributes);

    attributesKeys.forEach((key) => {
        if (key === 'data') {
            const dataAttributes = attributes[key];
            const dataAttributesKeys = Object.keys(dataAttributes);

            dataAttributesKeys.forEach((key) => {
                element.dataset[key] = dataAttributes[key];
            });
        } else {
            element[key] = attributes[key];
        }
    });

    return element;
};

/**
 * Cache elements with [data-view] attribute and put them in given object
 *
 * @param {Object} obj - Object to store elements
 */
export const cacheElements = (obj, attr = 'view') => {
    const newObj = {};
    const elements = document.querySelectorAll(`[data-${attr}]`);

    Array.prototype.forEach.call(elements, (el) => {
        const name = el.dataset[attr];
        newObj[name] = el;
    });

    Object.assign(obj, newObj);
};

/**
 * Get all siblings of specified element, excluding this element
 *
 * @param {Element} element
 * @returns {Array}
 */
export const getSiblings = (element) => {
    const siblings = [];
    let sibling = element.parentNode.firstChild;

    for (; sibling; sibling = sibling.nextSibling) {
        if (sibling.nodeType !== 1 || sibling === element) {
            continue;
        }
        siblings.push(sibling);
    }

    return siblings;
};

/**
 * Remove all children from element
 *
 * @param {Element} parent
 */
export const removeChildren = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

/**
 * Remove specified element from its parent
 *
 * @param {Element} element
 */
export const removeElement = (element) => {
    if (element) {
        element.parentNode.removeChild(element);
    }
};

/**
 * Transform html string to node
 *
 * @param {String} html
 * @returns {Element}
 */
export const htmlStringToNode = (html) => {
    const el = document.createElement('div');

    el.innerHTML = html;

    return el.firstChild;
};

/**
 * Prepend source element before first child of target element
 *
 * @param {Element} parent
 * @param {Element} el
 */
export const prepend = (parent, el) => {
    parent.insertBefore(el, parent.firstChild);
};

/**
 * Quick check if element is in DOM
 *
 * @param {Element} el
 * @returns {Element|Undefined}
 */
export const isElementInDom = el => el.parentNode;
