import * as LibLoader from '../LibLoader.js';
import '../../vendor/whenzel/1.0.2/whenzel.js';
import {AjvUtils, Fetcher} from '../Utils.js';

let countdown; // FIXME: initialized in load()
let validateFuncPromise = AjvUtils.getValidateFunc(new URL("../../schema/anniversaries.schema.yaml", import.meta.url));

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
                    .reduce((acc, cur) => acc | countdown[cur], 0);
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
        date: date,
        message: replaceKeywords(anniversary, now)
    }
}

function whenzelizeAll(anniversaryJson, now) {
    const anniversaryTypes = anniversaryJson.types.reduce((acc, cur) => {
        acc[cur.type] = cur;
        return acc;
    }, {});
    const anniversaries = [];
    for (let anniversary of anniversaryJson.anniversaries) {
        countdown.resetLabels();
        setCountdownLabels(anniversaryJson.labels);
        if (typeof anniversary.type !== 'undefined') {
            if (typeof anniversaryTypes[anniversary.type] !== 'undefined') {
                // merge properties of the type and the current anniversary
                anniversary = Object.assign(Object.assign({}, anniversaryTypes[anniversary.type]), anniversary);
            } else {
                throw new Error(`Unknown anniversary type '${anniversary.type}'`);
            }
        }
        setCountdownLabels(anniversary.labels);
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
        const yaml = await Fetcher.fetchYaml(url);
        messages.unprocessed = await AjvUtils.validateAndThrowOnError(yaml, await validateFuncPromise);
        messages.all = whenzelizeAll(messages.unprocessed, now);
        messages.filtered = messages.all
            .filter(mod => mod.date <= now)
            .filter(mod => Whenzel.test(mod.when, now));
        return messages;
    } catch (err) {
        err.message = `Unable to process ${url.href}: ${err.message}`;
        return {all: [], filtered: [], error: err};
    }
}

export {load};
