/**
 * This is the place for functions that are not normally used in production, but rather for testing.
 */
class Debug {
    constructor(params) {
        this._config = params.config;
        this._announcementManager = params.announcementManager;
    }

    getAllAnnouncements() {
        return this._config.announcements.all.concat(this._config.announcements.anniversaries.all);
    }

    async showAllAnnouncements(announcements) {
        if (typeof announcements === 'undefined')
            announcements = this.getAllAnnouncements();
        console.log(`Showing ${announcements.length} announcements in a row.`);
        for (let a of announcements) {
            console.log(a);
            await this._announcementManager.announce(
                a.message,
                {duration: 7 * 24 * 60 * 60 * 1000 /* 10 min */, fadeInDuration: 0, fadeOutDuration: 0}
            );
        }
        console.log(`Done showing ${announcements.length} announcements in a row.`);
    }

    async showAllAnnouncementsForToday() {
        await this.showAllAnnouncements(this._config.announcements.forToday);
    }
}

export default Debug;
