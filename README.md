The main entry point is `index.php`. This multi role script can act as a launcher, web server and heartbeat observer at the same time.

- simple start: `php index.php`
- start on separate X screen: ``xinit `which php` index.php -- :1 vt8``
- it might be necessary to set `allowed_users=anybody` in `/etc/X11/Xwrapper.config` (try `sudo dpkg-reconfigure x11-common`)

## Fonts

This project optionally uses the commercial font [Brown](https://lineto.com/). 

The following font files need to be put into the `/fonts` folder:
```
Brown-Regular.woff
BrownStd-Regular.eot
BrownStd-Regular.woff
brown-light-webfont.woff2
brown_thin-webfont.woff2
```

The font files can also be included via the password protected git submodule for those who have access to it: 
