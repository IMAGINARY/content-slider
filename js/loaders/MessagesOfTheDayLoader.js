import {AjvUtils, Fetcher} from '../Utils.js';
import '../../vendor/whenzel/1.0.2/whenzel.js';

let validateFuncPromise = AjvUtils.getValidateFunc(new URL("../../schema/messagesSchema.yaml", import.meta.url));

async function load(url, now) {
    try {
        const yaml = await Fetcher.fetchYaml(url);
        const messages = {};
        messages.all = await AjvUtils.validateAndThrowOnError(yaml, await validateFuncPromise);
        messages.filtered = messages.all.filter(mod => Whenzel.test(mod.when, now));
        return messages;
    } catch (err) {
        err.message = `Unable to process ${url.href}: ${err.message}`;
        return {all: [], filtered: [], error: err};
    }
}

export {load};
