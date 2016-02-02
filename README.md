The main entry point is `index.php`. This multi role script can act as a launcher, web server and heartbeat observer at the same time.

- simple start: `php index.php`
- start on separate X screen: ``xinit `which php` index.php -- :1 vt8``
- it might be necessary to set `allowed_users=anybody` in `/etc/X11/Xwrapper.config` (try `sudo dpkg-reconfigure x11-common`)
