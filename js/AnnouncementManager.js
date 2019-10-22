import {IdleDetector} from "./IdleDetector.js";
import '../vendor/content-slider-announcer/1.2.1/assets/js/content-slider-announcer.js';

const contentSliderAnnouncerHtmlUrl = new URL('../vendor/content-slider-announcer/1.2.1/index.html', import.meta.url);

class AnnouncementManager {
    constructor(options) {
        // copy _messages array for later shuffling
        this._messages = [...options.messages];

        this._delay = options.delay;
        this._announcerOptions = options.announcerOptions;
        this._idleDetector = new IdleDetector();

        // initiate async operation
        if (this._messages.length > 0)
            this.run().then(() => console.warn("Announcements discontinued for reasons unknown"));
    }

    next() {
        console.assert(this._messages.length > 0);
        if (this._messages.length > 1) {
            // move a random message to the first position such that the same message isn't displayed repeatedly
            const randomIndex = 1 + Math.floor(Math.random() * (this._messages.length - 1));
            const message = this._messages[randomIndex];
            this._messages[randomIndex] = this._messages[0];
            this._messages[0] = message;
        }
        return this._messages[0];
    }

    async announceRandom(announcerOptions) {
        await this.announce(this.next(), announcerOptions);
    }

    async announce(message, announcerOptions) {
        if (typeof announcerOptions === 'undefined')
            announcerOptions = this._announcerOptions;
        IMAGINARY.ContentSliderAnnouncer.hideAnnouncementNow();
        await IMAGINARY.ContentSliderAnnouncer
            .createAnnouncement(
                contentSliderAnnouncerHtmlUrl.href,
                message,
                announcerOptions,
            );
    }

    async waitForIdle() {
        await new Promise(resolve => this._idleDetector.setTimeoutOnce(resolve, this._delay));
    }

    async run() {
        while (true) {
            await this.waitForIdle();
            await this.announceRandom();
        }
    }
}

export {AnnouncementManager};
