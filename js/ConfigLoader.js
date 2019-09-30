import {AjvUtils, Fetcher} from './Utils.js';

let validateFuncPromise = AjvUtils.getValidateFunc(new URL("../schema/configSchema.yaml", import.meta.url));

async function load(url) {
    const yaml = await Fetcher.fetchYaml(url);
    const config = await AjvUtils.validateAndThrowOnError(yaml, await validateFuncPromise);
    config.configUrl = url;
    return config;
}

export {load};
