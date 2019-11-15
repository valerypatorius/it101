import Config from './config';
import BaseSpecial from './base';
import Data from './data';
import Analytics from './lib/analytics';

import { makeElement, removeChildren } from './lib/dom';
import { scrollToElement } from './lib/helper';

/**
 * Helper wrapper for pretty console messages
 * @param  {...any} args
 */
const log = (...args) => {
    console.log(`%c[${Config.name}]`, 'color: #19b5fe', ...args);
}

/**
 * Max lives count
 */
const MAX_LIVES = 3;

/**
 * DOM elements cache
 */
const EL = {};

/**
 * CSS classnames
 */
const CSS = {
    base: 'sp-it101',
};

/**
 * Helper method to form BEM classnames
 * @param {String} child
 */
const bem = (child) => {
    return `${CSS.base}__${child}`;
};

/**
 * Special constructor
 */
class Special extends BaseSpecial {
    constructor(params) {
        super(params);

        this.progress = null;
        this.question = null;
        this.lives = MAX_LIVES;
        this.isInputDisabled = false;
    }

    /**
     * Prepare layout and initialize special
     */
    init() {
        log('Initialize');

        this.progress = 0;

        this.container.classList.add(CSS.base);

        if (this.params.isCompact) {
            this.container.classList.add(CSS.base + '--compact');
        }

        this.prepareLayout();
        this.setQuestion(this.progress);
        this.setLives(this.lives);
    }

    /**
     * Prepare main layout
     */
    prepareLayout() {
        EL.header = makeElement('div', bem('header'));
        this.container.appendChild(EL.header);

        this.prepareLives();

        EL.question = makeElement('div', bem('question'));
        EL.header.appendChild(EL.question);

        EL.content = makeElement('div', bem('content'));
        this.container.appendChild(EL.content);

        this.prepateProgressBar();
    }

    /**
     * Prepare lives layout
     */
    prepareLives() {
        EL.lives = [];

        const parent = makeElement('div', bem('lives'));

        for (let i = 0; i < MAX_LIVES; i += 1) {
            const item = makeElement('div', bem('live'), {
                innerHTML: Data.svg.heart.empty + Data.svg.heart.full,
            });

            parent.appendChild(item);
            EL.lives.push(item);
        }

        EL.header.appendChild(parent);
    }

    /**
     * Set new lives count
     * @param {Number} count
     */
    setLives(count) {
        if (count > MAX_LIVES) {
            return;
        }

        this.lives = count;

        EL.lives.forEach((item, index) => {
            if (index < MAX_LIVES - count) {
                item.classList.add(bem('live--empty'));
            } else {
                item.classList.remove(bem('live--empty'));
            }
        });
    }

    /**
     * Update progress bar with info about last answer
     * @param {Number} index
     * @param {Boolean} isCorrect
     */
    setProgress(index, isCorrect) {
        EL.progress[index].classList.add(bem(isCorrect ? 'progress__item--correct' : 'progress__item--incorrect'));
    }

    /**
     * Set new question and options
     * @param {Number} index
     */
    setQuestion(index) {
        const question = Data.questions[index];

        if (!question) {
            return;
        }

        this.container.dataset.progress = index;
        this.question = question;

        EL.question.innerHTML = `<span>${this.question.title}</span>`;

        this.setOptions(question.options);

        this.isInputDisabled = false;

        log('Set question', index);
        Analytics.sendEvent(`Question ${index + 1}`, 'Show');
    }

    /**
     * Set answer options
     * @param {Array} items
     */
    setOptions(items) {
        removeChildren(EL.content);

        EL.options = [];

        items.forEach((item) => {
            const option = makeElement('div', bem('option'), {
                data: {
                    click: 'answer',
                    value: item.value,
                },
            });
            EL.content.appendChild(option);
            EL.options.push(option);

            this.prepareGrid(option);

            const label = makeElement('div', bem('option__label'), {
                textContent: item.title,
            });
            option.appendChild(label);

            const icon = makeElement('div', bem('option__icon'), {
                innerHTML: item.icon,
            });
            option.appendChild(icon);
        });
    }

    /**
     * Prepare layout for decorative grid pattern
     * @param {Element} parent
     */
    prepareGrid(parent) {
        const x = 15;
        const y = 4;

        const grid = makeElement('div', bem('grid'));
        const gridX = makeElement('div', bem('grid__x'));
        const gridY = makeElement('div', bem('grid__y'));

        for (let i = 0; i < x; i += 1) {
            const line = makeElement('div', [bem('grid__line'), bem('grid__line--vertical')]);
            gridX.appendChild(line);
        }

        for (let i = 0; i < y; i += 1) {
            const line = makeElement('div', [bem('grid__line'), bem('grid__line--horizontal')]);
            gridY.appendChild(line);
        }

        grid.appendChild(gridX);
        grid.appendChild(gridY);
        parent.appendChild(grid);
    }

    /**
     * Prepare layout for progress bar
     */
    prepateProgressBar() {
        EL.progress = [];

        const parent = makeElement('div', bem('progress'));

        for (let i = 0; i < Data.questions.length; i += 1) {
            const item = makeElement('div', bem('progress__item'));

            parent.appendChild(item);
            EL.progress.push(item);
        }

        const logo = makeElement('a', bem('progress__logo'), {
            innerHTML: Data.svg.logo,
            target: '_blank',
            href: Data.final.button.url,
        });
        parent.appendChild(logo);

        this.container.appendChild(parent);
    }

    /**
     * Call when answer option is clicked.
     * Show correct/incorrect info, update lives and proceed to next screen
     * @param {Element} clickedOption
     */
    answer(clickedOption) {
        if (this.isInputDisabled) {
            return;
        }

        this.isInputDisabled = true;

        let afterAnswerDelay = 1000;

        const selectedValue = parseInt(clickedOption.dataset.value);
        const isSelectedCorrect = selectedValue === this.question.correct;

        clickedOption.classList.add(bem(isSelectedCorrect ? 'option--correct' : 'option--incorrect'));

        EL.options.forEach((option, index) => {
            const value = parseInt(option.dataset.value);
            const isCorrectOption = value === this.question.correct;
            const answerMessage = this.question.message;

            if (!isSelectedCorrect && isCorrectOption) {
                option.classList.add(bem('option--correct'));
                option.classList.add(bem('option--delayed'));
            }

            if (isCorrectOption && answerMessage) {
                const message = makeElement('div', bem('option__message'), {
                    textContent: answerMessage,
                });

                option.appendChild(message);
                option.classList.add(bem('option--message'));

                afterAnswerDelay = 2000;
            }

            option.classList.add(bem('option--disabled'));
        });

        if (!isSelectedCorrect) {
            this.lives -= 1;
            this.setLives(this.lives);
        }

        this.setProgress(this.progress, isSelectedCorrect);

        setTimeout(() => {
            this.afterAnswer();
        }, afterAnswerDelay);

        log('Answer', isSelectedCorrect);
        Analytics.sendEvent(`Question ${this.progress + 1} — Answer — ${isSelectedCorrect ? 'Right' : 'Wrong'}`);
    }

    /**
     * Proceed to next screen:
     * - finish unsuccessfully
     * - finish successfully
     * - show next question
     */
    afterAnswer() {
        scrollToElement(this.container, 50);

        if (this.lives <= 0) {
            this.finish(false);
            return;
        }

        if (this.progress >= Data.questions.length - 1) {
            this.finish(true);
            return;
        }

        this.progress += 1;
        this.setQuestion(this.progress);
    }

    /**
     * Show final screen
     * @param {Boolean} isFinished
     */
    finish(isFinished) {
        this.container.dataset.progress = -1;
        this.question = null;

        const titleClassname = isFinished ? bem('question__finished') : bem('question__unfinished');

        EL.question.innerHTML = `<span class="${titleClassname}">${isFinished ? 'Mission completed' : 'Game over'}</span>`;

        this.prepareFinal(isFinished);

        log('Finish', isFinished);
        Analytics.sendEvent(`Final screen — ${isFinished ? 'Success' : 'Fail'}`, 'Show');
        Analytics.sendEvent(`Final screen — Lives — ${this.lives}`, 'Show');
    }

    /**
     * Prepare final screen layout
     * @param {Boolean} isFinished
     */
    prepareFinal(isFinished) {
        removeChildren(EL.content);

        const parent = makeElement('div', bem('final'));
        EL.content.appendChild(parent);

        const background = makeElement('div', bem('final__background'), {
            innerHTML: Data.svg.final.gray + Data.svg.final.red + Data.svg.final.mobile,
        });
        parent.appendChild(background);

        const title = makeElement('div', bem('final__title'), {
            innerHTML: isFinished ? Data.final.title.finished : Data.final.title.unfinished,
        });
        parent.appendChild(title);

        const text = makeElement('div', bem('final__text'), {
            innerHTML: isFinished ? Data.final.text.finished : Data.final.text.unfinished,
        });
        parent.appendChild(text);

        const actions = makeElement('div', bem('final__actions'));
        parent.appendChild(actions);

        const button = makeElement('a', bem('final__button'), {
            target: '_blank',
            href: Data.final.button.url,
            textContent: Data.final.button.text,
        });
        actions.appendChild(button);

        const restart = makeElement('div', bem('final__restart'), {
            innerHTML: Data.svg.restart + 'Ещё раз',
            data: {
                click: 'restart',
            },
        });
        actions.appendChild(restart);
    }

    /**
     * Restart special
     */
    restart() {
        scrollToElement(this.container, 50);

        this.progress = 0;
        this.setQuestion(this.progress);

        this.lives = MAX_LIVES;
        this.setLives(this.lives);

        EL.progress.forEach((item) => {
            item.classList.remove(bem('progress__item--correct'));
            item.classList.remove(bem('progress__item--incorrect'));
        });

        log('Restart');
        Analytics.sendEvent('Restart');
    }
}

export default Special;
