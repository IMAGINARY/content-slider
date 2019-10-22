import EventEmitter from 'events';

/**
 * Interface that creates an announcer inside an iframe.
 */
export default class AnnouncerFrame {
  constructor() {
    this.busy = false;
    this.visible = false;
    this.wrapper = null;
    this.iframe = null;
    this.hideTimeout = null;
    this.events = new EventEmitter();
  }

  /**
   * Show an announcement.
   *
   * This method creates an iframe attached to the current page's body.
   * The frame will be removed when the announcement ends its duration
   * or it's manually hidden.
   *
   * This method will fail (with a rejection) if an announcement is already
   * in progress.
   *
   * @param {string} announcerSrc
   *  URL of the index.html file of content-slider-announcer
   * @param {string} text
   *  Text to display
   * @param {object} options
   *  Options (see README)
   * @return Promise
   *  Returns a promise that resolves when the announcement is closed
   */
  show(announcerSrc, text, userOptions = {}) {
    return new Promise((resolve, reject) => {
      if (this.busy || this.visible) {
        reject(new Error('Announcement already in progress.'));
      }
      this.busy = true;

      const defaultOptions = {
        duration: 60000,
        fadeOutDuration: 2000,
      };
      const options = Object.assign({}, defaultOptions, userOptions);

      this.visible = true;
      this.wrapper = window.document.createElement('div');
      this.wrapper.classList.add('content-slider-announcer-wrapper');
      this.iframe = window.document.createElement('iframe');
      this.iframe.setAttribute('src', announcerSrc);
      this.iframe.setAttribute('allowtransparency', 'true');
      this.iframe.addEventListener('load', () => {
        this.iframe.contentWindow.postMessage({
          type: 'announce',
          text,
          options: userOptions,
        });
      });
      const eventMask = window.document.createElement('div');
      eventMask.classList.add('content-slider-announcer-eventMask');
      eventMask.addEventListener('pointerdown', () => {
        this.hide(options.fadeOutDuration);
      });
      this.wrapper.append(this.iframe);
      this.wrapper.append(eventMask);
      window.document.querySelector('body').append(this.wrapper);

      this.hideTimeout = setTimeout(() => {
        this.hide(options.fadeOutDuration);
        this.clearTimeoutTimer();
      }, options.duration);

      this.events.once('close', () => {
        resolve();
      });

      this.busy = false;
    });
  }

  /**
   * Hide the current announcement with a fade out animation.
   */
  hide(duration = AnnouncerFrame.HIDE_DELAY) {
    if (this.busy || !this.visible) {
      return;
    }
    this.busy = true;

    this.iframe.contentWindow.postMessage({
      type: 'hide',
      duration,
    });
    setTimeout(() => {
      this.destroyFrame();
      this.busy = false;
    }, duration);
  }

  /**
   * Hide the current announcement immediately.
   */
  hideNow() {
    if (this.busy || !this.visible) {
      return;
    }
    this.busy = true;
    this.destroyFrame();
    this.busy = false;
  }

  /**
   * Destroy the iframe and perform cleanup
   */
  destroyFrame() {
    this.clearTimeoutTimer();
    this.wrapper.remove();
    this.wrapper = null;
    this.iframe = null;
    this.visible = false;
    this.events.emit('close');
  }

  /**
   * Clear and null the timeout timer
   */
  clearTimeoutTimer() {
    if (this.hideTimeout !== null) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }
}

AnnouncerFrame.HIDE_DELAY = 2000;
