import {AjvUtils, Fetcher} from '../Utils.js';
import '../../vendor/whenzel/1.0.2/whenzel.js';

let validateFuncPromise = AjvUtils.getValidateFunc(new URL("../../schema/whenzelSchema.yaml", import.meta.url));

async function load(url, now) {
    try {
        const yaml = await Fetcher.fetchYaml(url);
        const entries = {};
        entries.all = await AjvUtils.validateAndThrowOnError(yaml, await validateFuncPromise);
        entries.filtered = entries.all.filter(entry => Whenzel.test(entry.when, now));
        return entries;
    } catch (err) {
        err.message = `Unable to process ${url.href}: ${err.message}`;
        return {all: [], filtered: [], error: err};
    }
}

export {load};
