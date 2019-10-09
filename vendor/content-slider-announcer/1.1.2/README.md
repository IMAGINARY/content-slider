# content-slider-announcer

Full screen announcements for the Content Slider

## Usage

The content-slider-announcer creates full screen announcements through a combination of
[durden](https://github.com/IMAGINARY/durden) backgrounds and 
[text-poster](https://github.com/IMAGINARY/text-poster) texts. The announcement is created
on a dynamically created iframe which is destroyed when it's closed.

To use it import `assets/js/content-slider-announcer.js` and call:

```
IMAGINARY.ContentSliderAnnouncer.createAnnouncement(announcerSrc, text, options = {});
```

(the component is available as a module for importing through require() or globally in
`IMAGINARY.ContentSliderAnnouncer`).

- **announceSrc** should be an URL pointing to the index.html file in the root of this
project.
- **text** is whatever announcement you want to show, which will be formatted using `text-poster`.
- **options** is an object with options (all optional). See below.

This function will return a **Promise** that resolves when the announcement is closed (either
by timeout or manually) and rejects if there's an announcement already in progress.

To hide the announcement just call

```
IMAGINARY.ContentSliderAnnouncer.hideAnnouncement();
```

or

```
IMAGINARY.ContentSliderAnnouncer.hideAnnouncementNow();
```

for hiding it without any animation / transition and no delay.


### Options

#### Themes

The announcer can be given several different themes and it'll pick one at random.

Add an option called **themes** with an array of theme names:

```
themes: ['autumn1', 'autumn2', 'autumn3']
```

and add extra options describing each theme

```
theme_autumn1: { mode: 'periodic-supertile', colors: ['#ff0000', '#00ff00']},
theme_autumn2: { mode: 'random', colors: ['#ff0000', '#00ff00', '#ffff00']},
theme_autumn3: { mode: 'random-supertile', colors: ['#fff0ff', '#ff00ff', '#00ffff', '#ffff00']},
```

(note that each theme option must have `theme_` preappended to its name)

Themes are objects with two properties:

- **mode**: One of
    - **random**: Color tiles at random
    - **periodic**: Color tiles using the colors in order, cyclically.
    - **random-supertile**: Color supertiles at random
    - **periodic-supertile**: Color supertiles using the colors in order, cyclically.
- **colors**: An array of colors in #rrggbb format. The array can be of any length.

#### Timing

Control timing with this options:

- **duration** (in ms, default 60000): How long the announcement will be shown 
  (without counting fade-in / out animations).  
- **fadeInDuration** (in ms, default 5000): How much the tiling takes to appear.
- **transformLoopDuration** (in ms, default 30000): How much a single loop of tiling transformation will take.

#### Durden tiling

Control the durden pentagonal tiling with this options:

- **tilesAcross** (default 8): Number of supertiles horizontally.
- **tilesVertically** (default 20): Number of supertiles vertically.
- **startAngle** (in degrees, default 150): The angle at which the animation will start.
- **endAngle** (in degrees, default Durden.MIN_ANGLE): The angle at which the animation will end.
- **strokeWidth** (default 1): Width of the stroke around the tiles.
- **strokeColor** (default #000000): Color of the stroke around the tiles.
