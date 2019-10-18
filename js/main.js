import * as ConfigLoader from './loaders/ConfigLoader.js';
import * as sliderFunctions from './slider-functions.js';
import ErrorApp from './ErrorApp.js';
import DummyConsole from './dummy-console.js';
import MouseEventSupporessor from './stop-mouse-event-propagation.js';
import {ReloadButtons, IdleReloader, ErrorReloader} from './auto-page-reloader.js';
import Cursor from './touch-cursor.js';
import DebugOverlay from './debug-overlay.js';
import * as MessagesOfTheDayLoader from './loaders/MessagesOfTheDayLoader.js';
import * as AnniversariesLoader from './loaders/AnniverariesLoader.js';
import * as WhenzelLoader from './loaders/WhenzelLoader.js';
import '../vendor/whenzel/1.0.2/whenzel.js';
import {AnnouncementManager} from './AnnouncementManager.js';

let announcementManager = null;

function fadeIn(delayInS) {
    // fade-in the whole page after some user-defined delay
    const wrapper = document.getElementById('wrapper');
    wrapper.style.animationDelay = `${delayInS}s`;
    wrapper.style.animationPlayState = 'running';
    const endOfFadeInHandler = ae => {
        if (ae.animationName === 'fadeIn') {
            wrapper.classList.remove('fade-in');
            wrapper.removeEventListener('animationend', endOfFadeInHandler);
        }
    };
    wrapper.addEventListener('animationend', endOfFadeInHandler);
}

async function loadApp(absoluteAppUrl, configOverrideProcessor) {
    const appClass = (await import(absoluteAppUrl)).default;

    if (typeof configOverrideProcessor !== 'function')
        configOverrideProcessor = () => new Object();

    const configOverride = configOverrideProcessor(await appClass.getConfigOverrides());
    console.log('Loading', appClass.name, 'with config override', configOverride);
    return new appClass(configOverride);
}

function processConfigOverrides(overrides, today) {
    return overrides
        .filter(override => override.type === 'whenzel')
        .filter(override => Whenzel.test(override.when, today))
        .reduce((acc, cur) => Object.assign(acc, cur.config), {});
}

async function initializeAppsAndSlider(config) {
    // load common JavaScript dependencies
    if (typeof config['common'] !== 'undefined' && config['common'] !== null && config['common'].length > 0) {
        await loadjs(config['common'], {async: false, returnPromise: true})
            .catch(failedUrls => console.error('loading common script failed:', failedUrls));
    }

    // NOTE: app URLs are resolved relative to the config file
    const configOverrideProcessor = overrides => processConfigOverrides(overrides, config.today);
    const loadSlide = async appUrl => {
        const app = await (async () => {
            try {
                return await loadApp(new URL(appUrl, config.configUrl), configOverrideProcessor);
            } catch (err) {
                console.error(err);
                return new ErrorApp(`Unable to load app "${appUrl}"`);
            }
        })();
        return {slide: sliderFunctions.createSlide(app), app: app};
    };

    const createSliderWithSlides = async (appUrls, sliderNum) => {
        // create
        const slidesAndApps = await Promise.all(appUrls.map(loadSlide));
        const slides = slidesAndApps.map(slideAndApp => slideAndApp.slide);
        const apps = slidesAndApps.map(slideAndApp => slideAndApp.app);

        // insert
        const slidesWrapper = document.getElementById(`slides${sliderNum}`);
        slides.forEach(slide => slidesWrapper.appendChild(slide));

        // result
        return {
            slider: sliderFunctions.jssor_app_slider_starter(`slider${sliderNum}_container`, apps, config),
            slides: slides,
            apps: apps,
        };
    };

    const sliders = await Promise.all(config['apps'].map(createSliderWithSlides));
    const allApps = sliders.reduce((a, c) => a.concat(c.apps), []);

    // the following promise settles when all apps are either ready or failed initialization
    const reflect = p => p.then(v => ({v, fulfilled: true}), e => ({e, fulfilled: false}));
    return Promise.all(allApps.map(app => reflect(app.ready))).then(() => sliders);
}

function applyConfig(config) {
    // create a new stylesheet for inserting configurable CSS rules
    const sheet = (function () {
        // Create the <style> tag
        const style = document.createElement("style");
        // WebKit hack :(
        style.appendChild(document.createTextNode(""));
        // Add the <style> element to the page
        document.head.appendChild(style);
        return style.sheet;
    })();

    // show or hide the cursor
    if (config['hideCursor'])
        sheet.insertRule("* { cursor: none !important; }", sheet.rules.length);

    // hide scrollbars and disable scrolling
    if (config['disableScrolling'])
        sheet.insertRule("body { overflow: hidden; }", sheet.rules.length);

    // set the background animation
    document.getElementById('bg').src = config['backgroundAnimationUrl'];

    // set the credits
    document.getElementById('credits').innerHTML = config.credits;

    // add messages of the day
    // TODO: a proper user-facing warning related to parsing the messages files
    const modSlidesWrapper = document.querySelector('#slider_top [u="slides"]');
    const createModSlide = message => {
        const slideDiv = document.createElement('div');
        slideDiv.classList.add('slide');
        const slideContentDiv = document.createElement('div');
        slideContentDiv.classList.add('slide-content');
        slideContentDiv.innerHTML = message;
        const textLen = slideContentDiv.textContent.length;
        if (textLen > 100) {
            slideContentDiv.classList.add('slide-content-s');
        } else if (textLen > 40) {
            slideContentDiv.classList.add('slide-content-m');
        } else {
            slideContentDiv.classList.add('slide-content-l');
        }
        slideDiv.append(slideContentDiv);
        return slideDiv;
    };
    config.messagesOfTheDay.forEach(mod => modSlidesWrapper.appendChild(createModSlide(mod.message)));
    sliderFunctions.simple_fade_slider(modSlidesWrapper);

    window.mouseEventSuppressor = new MouseEventSupporessor();
    mouseEventSuppressor.setEnabled(config['disableMouseEvents']);

    window.pageReloadButtons = new ReloadButtons({
        parentElement: document.getElementById('wrapper'),
        reloadButtonSize: config['reloadButtonSize'],
        reloadButtonHoldTime: config['reloadButtonHoldTime'],
    });
    pageReloadButtons.setEnabled(true);

    window.idleReloader = new IdleReloader({
        reloadDelay: config['reloadDelay'],
        idleDelay: config['idleDelay'],
    });
    idleReloader.setEnabled(true);

    window.errorReloader = new ErrorReloader({
        reloadDelay: config['reloadOnErrorDelay']
    });
    errorReloader.setEnabled(typeof config['reloadOnErrorDelay'] !== 'undefined' && config['reloadOnErrorDelay'] >= 0);

    const cursorElem = (() => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = config['touchCursorHtml'];
        return tempDiv.children[0];
    })();
    window.cursor = new Cursor({
        createCursorElement: () => {
            const cursor = cursorElem.cloneNode(true);
            cursor.style.opacity = '0.25';
            return cursor;
        },
        downHandler: cursor => cursor.style.opacity = '1.0',
        upHandler: cursor => cursor.style.opacity = '0.25',
    });
    cursor.setEnabled(config['touchCursorVisible']);

    window.debugOverlay = new DebugOverlay({debugCursorScale: config['debugCursorScale']});
    debugOverlay.setEnabled(config['debuggingEnabled']);

    DummyConsole.setEnabled(config['disableConsoleLogging']);

    // set up the announcer
    const messages = config.announcements.filtered.map(a => a.message);
    const collapseOptions = whenzelConfigs => whenzelConfigs.reduce((acc, cur) => Object.assign(acc, cur.data), {});
    const announcerOptions = collapseOptions(config.announcementSettings.filtered);
    announcementManager = new AnnouncementManager({
        messages: messages,
        delay: config["announcementDelay"] * 1000,
        announcerOptions: announcerOptions,
    });
}

async function domContentLoaded() {
    return await new Promise((resolve) => {
        if (
            document.readyState === "complete" ||
            (document.readyState !== "loading" && !document.documentElement.doScroll)
        ) {
            setTimeout(resolve, 0);
        } else {
            document.addEventListener("DOMContentLoaded", resolve);
        }
    });
}

async function preprocessConfig(config) {
    // date override supplied?
    if (typeof config.today !== 'undefined') {
        const todaysTimestamp = Date.parse(config.today);
        if (Number.isNaN(todaysTimestamp))
            throw new Error(`Invalid timestamp provided for config property 'today': ${config['reloadOnErrorDelay']}`);
        else
            config.today = new Date(todaysTimestamp);
    } else {
        config.today = new Date();
    }

    config.messages = await MessagesOfTheDayLoader.load(new URL(config.messagesUrl, config.configUrl), config.today);
    config.anniversaries = await AnniversariesLoader.load(new URL(config.anniversariesUrl, config.configUrl), config.today);
    config.messagesOfTheDay = config.messages.filtered.concat(config.anniversaries.filtered);
    config.announcements = await MessagesOfTheDayLoader.load(new URL(config.announcementsUrl, config.configUrl), config.today);
    config.announcementSettings = await WhenzelLoader.load(new URL(config.announcementSettingsUrl, config.configUrl), config.today);

    return config;
}

async function tryWithConfigUrl(configUrl, allowUrlParamOverrides) {
    try {
        console.log(`Trying to load config from ${configUrl}`);
        const config = await preprocessConfig(await ConfigLoader.load(configUrl, allowUrlParamOverrides));
        console.log(config);
        await domContentLoaded();

        try {
            applyConfig(config);
            try {
                const sliders = await initializeAppsAndSlider(config);
                console.log('All apps initialized (not necessarily successfully)');

                // store sliders as global variables to ease debugging
                window.sliders = sliders;
            } catch (err) {
                console.error("Error during slider and app initialization:", err);
            }
        } catch (err) {
            console.error("Error while applying config:", err);
        }

        return config;
    } catch (err) {
        switch (err.name) {
            case 'FetchError':
            case 'HTTPError':
                console.error("Error retrieving config file:", configUrl.href, `${err.status} (${err.statusText})`, err);
                throw err;
            case 'SyntaxError':
                console.error("Error while parsing config file:", err.message, err);
                break;
            case 'ValidationError':
                console.error("Error while validating config file:", err.message, err);
                break;
            case 'OverrideError':
                console.error("Error while applying config overrides:", err.message, err);
                break;
            default:
                throw err;
        }
    }
}

async function main(options) {
    try {
        try {
            window.config = await tryWithConfigUrl(new URL(options.configUrl), true);
        } catch (err) {
            const fallbackConfigUrl = new URL('cfg/config.sample.yaml', window.location.href);
            console.error("Unable to utilize config ", options.configUrl.href, "\nFalling back to ", fallbackConfigUrl.href);
            window.config = await tryWithConfigUrl(fallbackConfigUrl, false);
        }
        fadeIn(window.config['fadeinOnLoadDelay']);
    } catch (err) {
        fadeIn(0);
        throw err;
    }
}

export default main;
export {main, loadApp, processConfigOverrides};
