import * as LibLoader from './LibLoader.js';
import '../vendor/ajv/6.10.2/ajv.min.js';
import '../vendor/whenzel/1.0.2/whenzel.js';

let countdown; // FIXME: initialized in load()
let validateFuncPromise = getValidateFuncPromise();

async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok)
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    return response.json();
}

async function getValidateFuncPromise() {
    const ajv = new Ajv({verbose: true});
    const schema = await fetchJson(new URL("../schema/anniversariesSchema.json", import.meta.url));
    return ajv.compile(schema);
}

async function validateMessages(mods) {
    const validate = await validateFuncPromise;

    validate(mods);

    if (validate.errors !== null && validate.errors.length > 0) {
        const error = validate.errors[0];
        throw new Error(error.dataPath + ": " + error.data + " " + error.message);
    }

    return mods;
}

function replaceKeywords(anniversary, now) {
    const date = new Date(anniversary.date);
    return anniversary.message
        .replace(/(%%([^%]+)%%)/g, (match, $1, $2) => {
            // replace built-in keywords
            const ago_string_regex = /^ago\(((?:DEFAULT|ALL|MILLENNIA|CENTURIES|DECADES|YEARS|MONTHS|WEEKS|DAYS|HOURS|MINUTES|SECONDS|MILLISECONDS)(?:\|(?:DEFAULT|ALL|MILLENNIA|CENTURIES|DECADES|YEARS|MONTHS|WEEKS|DAYS|HOURS|MINUTES|SECONDS|MILLISECONDS))*)\)$/;
            if (ago_string_regex.test($2)) {
                const unitsString = ago_string_regex.exec($2)[1];
                const unitRegex = /DEFAULT|ALL|MILLENNIA|CENTURIES|DECADES|YEARS|MONTHS|WEEKS|DAYS|HOURS|MINUTES|SECONDS|MILLISECONDS/g;
                const units = Array.from(unitsString.matchAll(unitRegex))
                    .map(m => m[0])
                    .reduce((acc, cur) => {
                        console.log(acc, cur, acc | countdown[cur]);
                        return acc | countdown[cur];
                    }, 0);
                return countdown(date, now, units).toString();
            } else {
                // unknown keyword
                return $1;
            }
        }).replace(/(%([^%]+)%)/g, (match, $1, $2) => {
            // replace keywords corresponding to anniversary properties
            if (typeof anniversary[$2] !== 'undefined')
                return anniversary[$2];
            else
                return $1;
        });
}

function whenzelize(anniversary, now) {
    const date = new Date(anniversary.date);
    let when;
    switch (anniversary.every) {
        case "day":
            when = '????-??-??';
            break;
        case "month":
            when = `????-??-${("0" + (date.getMonth() + 1)).slice(-2)}`;
        case "year":
        default:
            when = `????-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
            break;
    }
    return {
        when: when,
        message: replaceKeywords(anniversary, now)
    }
}

function whenzelizeAll(anniversaryJson, now) {
    const {messages, labels} = anniversaryJson.types.reduce((acc, cur) => {
        acc.messages[cur.type] = cur.message;
        acc.labels[cur.type] = cur.labels;
        return acc;
    }, {messages: {}, labels: {}});
    const anniversaries = [];
    for (let anniversary of anniversaryJson.anniversaries) {
        countdown.resetLabels();
        setCountdownLabels(anniversaryJson.labels);
        if (typeof anniversary.type !== 'undefined') {
            setCountdownLabels(labels[anniversary.type]);
            anniversary = Object.assign({}, anniversary);
            if (typeof messages[anniversary.type] !== 'undefined')
                anniversary.message = messages[anniversary.type];
            else
                throw new Error(`Unknown anniversary type '${anniversary.type}'`);
            delete anniversary.type;
        } else {
            setCountdownLabels(anniversary.labels);
        }
        anniversaries.push(whenzelize(anniversary, now));
    }
    return anniversaries;
}

function setCountdownLabels(labels) {
    if (typeof labels !== 'undefined')
        countdown.setLabels(labels.singular, labels.plural, labels.last, labels.delim, labels.empty,);
}

async function load(url, now) {
    // FIXME: loading of countdown.js doesn't work via import and I work around it using a custom libLoader
    countdown = await LibLoader.countdownjs();
    try {
        const messages = {};
        messages.source = await validateMessages(await fetchJson(url));
        console.log(messages.source);
        messages.all = whenzelizeAll(messages.source, now);
        messages.filtered = messages.all.filter(mod => Whenzel.test(mod.when, now));
        return messages;
    } catch (err) {
        err.message = `Unable to process ${url.href}: ${err.message}`;
        return {all: [], filtered: [], error: err};
    }
}

export {load};
