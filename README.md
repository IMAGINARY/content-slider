# Content slider

[Online demo.](https://rawcdn.githack.com/IMAGINARY/content-slider/master/index.html)

This project implements an app player targeting large-scale vertical 16:9 touch displays. The player is split into three main, permanently visible areas:
- app slider at the top
- app slider at the bottom
- message area

Each slider is assigned a list of apps to start and the user can switch to the next or previous app using on-screen buttons.

The message area is for encouraging visitors to use the player and informing them about interesting app related facts or single-time or recurring events like anniversaries.

Additionally, the player is able to display [full-screen announcements](#announcements) when it's idle.

## Getting started

Clone the repository locally and put it somewhere under the root directory of a web server serving static files.

The main entry point is [`content-slider.html`](content-slider.html).

## Configuration

The slider can be configured by specifying a `cfg` URL parameter, e.g.
```
content-slider.html?cfg=config.sample.yaml
```
The given path will be resolved against the [`cfg`](cfg) directory. If the parameter is omitted, the default [`config.sample.yaml`](cfg/config.sample.yaml) will be used.

### Main configuration

The main configuration file specifies player settings like idle delays, credits texts, debug options and, most importantly, the selection of apps to include in the two sliders. The file format is [YAML](https://learnxinyminutes.com/docs/yaml/), but only the [JSON](https://learnxinyminutes.com/docs/json/) compatible subset is used such that plain JSON files are also accepted. However, YAML is usually easier readable by human beings.

All paths given in the configuration file that are not absolute paths are interpreted relative to the configuration file itself.

The collection of apps is specified as follows:
```yaml
apps:
  - - path/to/slider1/app1.js
    - path/to/slider1/app2.js
    - path/to/slider1/app3.js
    - ...
  - - path/to/slider2/app1.js
    - path/to/slider2/app2.js
    - ...
```
Each path points to a ES6 module that implements a subclass of [`Application`](js/application.js) and exports this class as the default (e.g. via `export default AppClassName`).

ES6 apps might rely on certain libraries to be loaded before the app is initialized. If possible, these libraries should be imported into the app module directly such that different apps don't interfere. Libraries not supporting the ES6 module syntax can be included via the config file as global dependencies common to all apps:
```yaml
common:
  - path/to/common/dependency1.js
  - path/to/common/dependency1.js
  - ...
```

Note that including mutually incompatible libraries as common dependencies can break certain apps. Think of apps that use the same framework, but in different versions that can not be used simultaneously.

To get started, check out our [ready-to-use collection of apps](https://github.com/IMAGINARY/content-slider-apps). Don't forget to include the [common dependencies](https://github.com/IMAGINARY/content-slider-apps/tree/master/common/js).

For a full reference of the all configurable options, check out the annotated [`config.samle.yaml`](cfg/config.sample.yaml) and the [config file schema definition](schema/config.schema.yaml).

#### Overridable configuration

Some of the properties in the [config file schema definition](schema/config.schema.yaml) are marked with `cfg-overridable: true`. Those can be passed  as URL parameters to the player. e.g.
```
content-slider.html?cfg=config.sample.yaml&today=2020-01-01'
```
will override the property `today` in the config file `config.sample.yaml` with `2020-01-01`.

### Messages of the day

The player contains an area for displaying visitor-facing messages. These messages are read from a file provided via
```yaml
messagesUrl: path/to/messages.yaml
```
According to the [messagges-of-the-day schema](schema/messages.schema.yaml), the YAML or JSON file contains a list of message entries. Each message is defined by the message text and a range of dates when it should be displayed.
```yaml
- when: '#always'  
  message: 'Show this every day.'
- when: '????-12-??'
  message: 'Show this in December only.'
```
The `when` property has to be a valid [Whenzel pattern](https://github.com/IMAGINARY/whenzel). The message text can contain arbitrary HTML tags, but normally, you would not need anything else besides `<br>` for introducing line breaks.

#### Anniversaries

Certain recurring events have some similarity. For example, notifications about birthdays should basically all look the same. They might also include the number of the birthday which needs to be computed using the current date. Messages for these kinds of events can specified via the file provided via
```yaml
anniversariesUrl: path/to/anniversaries.yaml
```
For details on the file format, check out the [example file](cfg/sample/anniversaries.yaml) and the [anniversary schema defition](schema/anniversaries.schema.yaml).

The entries from the anniversaries file are converted into the above messages format, i.e. having a `when` and a `message` property, substituting the templated messages along the way.

### Announcements

Announcements are similar to messages-of-the-day but they are displayed full screen to catch the visitors attention more aggressively. Announcements are provided in a separate file:
```yaml
announcementsUrl: path/to/announcements.yaml
```
A randomly chosen announcement is displayed once the player is idle for the given amount of seconds:
```yaml
announcementDelay: 20
```
The file format is identical to the messages-of-the-day with the only change that the message text is interpreted by [text-poster](https://github.com/IMAGINARY/text-poster), i.e. you have to use `\n` for adding line break.

The announcer accepts additional configuration options:
```yaml
announcementSettingsUrl: path/to/announcementSettings.yaml
```
The YAML or JSON file contains a list of objects like so:
```yaml
- when: '#always'
  data: {...}
- when: '????-03-20 / ????-06-19' # ~ spring
  data: {...}
...
```
The `when` property is again a [Whenzel pattern](https://github.com/IMAGINARY/whenzel). The `data` property contains options passed into [content-slider-announcer](https://github.com/IMAGINARY/content-slider-announcer#options). When the player starts, it removes all entries not relevant on the current date and collapses them into a single object. The options in the file are merged in order such that some always applicable default values can be specified at the top of the file and more specific settings can be added towards the bottom of the file, e.g. settings for Christmas are added to settings for winter which are added to the default settings.

## Creating new apps

Apps are defined as ES6 modules that export a subclass of [`Application`](js/application.js) by default. All apps run in the same HTML document since the two simultaneously visible apps are supposed to be usable at the same time, which can not be achieved if each apps would have been encapsulated into an `<iframe>` (only one `<iframe>` would have the input focus, even on a multi-touch screens).

#### Minimal app

A minimal app class looks like this:
```ecmascript 6
import Application from '../common/js/application.js';

class MinimalApp extends Application {
    constructor(config = {}) {
        super(Object.assign(MinimalApp.defaultConfig, config));
        this._domElement = document.createElement("div");
        this._domElement.innerText = "Hello!";
    }

    static get defaultConfig() {
        return {
            appName: 'Minimal app',
        };
    }

    get domElement() {
        return this._domElement;
    }
}

export default MinimalApp;
```
The constructor has the create the DOM element that will be added to the player. However, it is not necessary to create the full DOM subtree in the constructor. The construction of all children of the main element can be performed asynchronously. In order to do so, you have to overwrite the `ready()` `get`-method that returns a promise that resolves when the app is fully initialized.

#### App lifecycle

In contrast to the minimal app, most real-life apps have some dynamic content and allow for user interaction. Since some apps might perform computationally intense tasks, the `Application` class provides methods to `pause()`, `resume()` and `reset()` applications and those methods should be overwritten in subclasses:
- `pause()`: disable user interaction, pause animations and background tasks
- `play()`: enable user interaction, start animations and background tasks. An app should continue exactly where it left off when `pause()` was called.
- `reset()`: reset the app to its initial state

Calls of these methods before an app is `ready()` should be ignored.

#### App configuration

Each app should be configurable via the constructor. The string properties `appName`
`appDescription` and `appCredits` are available to all applications. They are passed into the `name()`, `description()` and `credits()` `get`-methods. Further properties can be added. To offer a highly flexible system, each app provides a set of default options via the static `defaultConfig()` `get`-method.

Additional predefined config can handed over to the player by overwriting the static asynchronous method `retrieveConfigOverrides()`. It has to return an array of objects having the following properties:
- `type` (required, string): Defines how to interpret this config override. While this can be app specific, the only type currently acknowledged by the player is `whenzel`, which requires the additional `when` property for filtering.
- `config` (required, object): A configuration suitable for passing into the constructor of the app.
- `when` (required for type `whenzel`, string): A [Whenzel pattern](https://github.com/IMAGINARY/whenzel) for selecting valid config entries for the current date.

Configuration objects should be passed to the superclass via `super()` (see [Minimal app](#minimal-app)) because not all properties might apply to the subclass itself.

#### Examples

Check out [`CindyApp`](https://github.com/IMAGINARY/content-slider-apps/blob/master/common/js/CindyApp.js) and its subclass for some more complex examples of apps compatible with this player.

## Fonts

This project optionally uses the commercial font [Brown](https://lineto.com/) (regular, thin and bold variants). 

The following font files need to be put into the `/fonts` folder:
```
Brown-Bold.eof
Brown-Bold.woff
Brown-Regular.woff
BrownStd-Regular.eot
BrownStd-Regular.woff`
brown-light-webfont.woff2
brown_thin-webfont.woff2
```

The font files can also be included via the access restricted `/fonts` git submodule for those who have access to it:
```
git submodule update --init --recursive
````

## License

Copyright (c) 2019 IMAGINARY
Licensed under the Apache v2.0 license. See [`LICENSE`](LICENSE) file.
