import '../vendor/js-yaml/3.13.1/js-yaml.min.js';
import * as sliderFunctions from './slider-functions.js';
import ErrorApp from './ErrorApp.js';
import DummyConsole from './dummy-console.js';
import MouseEventSupporessor from './stop-mouse-event-propagation.js';
import {ReloadButtons, IdleReloader, ErrorReloader} from './auto-page-reloader.js';
import Cursor from './touch-cursor.js';
import DebugOverlay from './debug-overlay.js';
import '../vendor/whenzel/1.0.2/whenzel.js';

async function loadApp(absoluteAppUrl, configOverrideProcessor) {
    const appClass = (await import(absoluteAppUrl)).default;
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
    if (config['hideCursor'])
        document.body.style.cursor = 'none';
    if (config['disableScrolling'])
        document.body.style.overflow = 'hidden';

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
};

function applyConfig(config) {
    // set the background animation
    document.getElementById('bg').src = config['backgroundAnimationUrl'];

    // fade-in the whole page after some user-defined delay
    const wrapper = document.getElementById('wrapper');
    wrapper.style.animationDelay = `${config['fadeinOnLoadDelay']}s`;
    wrapper.style.animationPlayState = 'running';
    const endOfFadeInHandler = ae => {
        if (ae.animationName === 'fadeIn') {
            wrapper.classList.remove('fade-in');
            wrapper.removeEventListener('animationend', endOfFadeInHandler);
        }
    };
    wrapper.addEventListener('animationend', endOfFadeInHandler);

    console.log(document.getElementById('wrapper').style.animationDelay, config['fadeinOnLoadDelay']);

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

async function request(obj) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(obj.method || "GET", obj.url);
        if (obj.headers) {
            Object.keys(obj.headers).forEach(key => {
                xhr.setRequestHeader(key, obj.headers[key]);
            });
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr);
            }
        };
        xhr.onerror = () => reject(xhr);
        xhr.send(obj.body);
    });
}

function parseConfig(configSrc, configUrl) {
    const jsYamlOptions = {
        filename: configUrl,
        onWarning: w => console.warn("Warning while parsing config file:", w),
        schema: jsyaml.JSON_SCHEMA,
    };
    const config = jsyaml.safeLoad(configSrc, jsYamlOptions);

    config.configUrl = configUrl;

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

    console.log(config);
    return config;
}

async function tryWithConfigUrl(configUrl) {
    try {
        const configSrc = await request({url: configUrl});
        try {
            const config = parseConfig(configSrc, configUrl);
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
        } catch (err) {
            console.error("Error while parsing config file:", err.message, err);
        }
    } catch (err) {
        console.error("Error retrieving config file:", configUrl.href, `${err.status} (${err.statusText})`, err);
        throw err;
    }
}

async function main(options) {
    try {
        await tryWithConfigUrl(new URL(options.configUrl));
    } catch (err) {
        const fallbackConfigUrl = new URL('config.sample.yaml', window.location.href);
        console.error("Unable to utilize config ", options.configUrl.href, "\nFalling back to ", fallbackConfigUrl.href);
        await tryWithConfigUrl(fallbackConfigUrl);
    }
}

export default main;
