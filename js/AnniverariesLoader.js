import '../vendor/ajv/6.10.2/ajv.min.js';
import '../vendor/whenzel/1.0.2/whenzel.js';

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

function diffDates(older, newer) {
    return {years: "yyyy", month: "mm", days: "dd"};
}

function replaceKeywords(anniversary, now) {
    const date = new Date(anniversary.date);
    const diff = diffDates(date, now);
    return anniversary.message
        .replace(/(%%([^%]+)%%)/g, (match, $1, $2) => {
            // replace built-in keywords
            switch ($2) {
                case 'years_ago':
                    return diff.years;
                case 'month_ago':
                    return diff.month;
                case 'days_ago':
                    return diff.days;
                default:
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
    const messages = {};
    anniversaryJson.types.forEach(t => messages[t.type] = t.message);
    const anniversaries = [];
    for (let anniversary of anniversaryJson.anniversaries) {
        if (typeof anniversary.type !== 'undefined') {
            anniversary = Object.assign({}, anniversary);
            if (typeof messages[anniversary.type] !== 'undefined')
                anniversary.message = messages[anniversary.type];
            else
                throw new Error(`Unknown anniversary type '${anniversary.type}'`);
            delete anniversary.type;
        }
        anniversaries.push(whenzelize(anniversary, now));
    }
    return anniversaries;
}

async function load(url, now) {
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
