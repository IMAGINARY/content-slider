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
    const ajv = new Ajv({verbose: true, removeAdditional: true});
    const schema = await fetchJson(new URL("../schema/messagesSchema.json", import.meta.url));
    const validateWhenzelPattern = pattern => {
        try {
            Whenzel.test(pattern);
            return true;
        } catch (err) {
            return false;
        }
    };
    ajv.addFormat("whenzel", validateWhenzelPattern);
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

async function load(url, now) {
    try {
        const messages = {};
        messages.all = await validateMessages(await fetchJson(url));
        messages.filtered = messages.all.filter(mod => Whenzel.test(mod.when, now));
        return messages;
    } catch (err) {
        err.message = `Unable to process ${url.href}: ${err.message}`;
        return {all: [], filtered: [], error: err};
    }
}

export {load};
