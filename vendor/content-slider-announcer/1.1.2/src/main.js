import Announcer from './announcer';
import AnnouncerFrame from './announcer-frame';

let announcerFrame = null;

/**
 * Show an announcement on screen
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
function createAnnouncement(announcerSrc, text, options = {}) {
  if (announcerFrame === null) {
    announcerFrame = new AnnouncerFrame();
  }
  return announcerFrame.show(announcerSrc, text, options);
}

/**
 * Hide the announcement
 */
function hideAnnouncement() {
  if (announcerFrame !== null) {
    announcerFrame.hide();
  }
}

/**
 * Hide the announcement without animations / delay
 */
function hideAnnouncementNow() {
  if (announcerFrame !== null) {
    announcerFrame.hideNow();
  }
}

/**
 * Does initialization in the frame used to show the announcements
 *
 * This method is called within the framed index.html. It's not really
 * part of the public interface.
 */
function initFrame() {
  const announcer = new Announcer();

  window.addEventListener('message', (event) => {
    const { type } = event.data;

    if (type === 'announce') {
      const { text, options } = event.data;
      announcer.announce(text, options);
    } else if (type === 'hide') {
      const { duration } = event.data;
      announcer.hide(duration);
    }
  }, false);
}

module.exports = {
  initFrame,
  createAnnouncement,
  hideAnnouncement,
  hideAnnouncementNow,
};
