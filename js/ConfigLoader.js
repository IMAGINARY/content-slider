import '../vendor/ajv/6.10.2/ajv.min.js';
import {Fetcher} from './Utils.js';

let validateFuncPromise = getValidateFuncPromise();

async function getValidateFuncPromise() {
    const ajv = new Ajv({verbose: true, removeAdditional: true});
    const schema = await Fetcher.fetchYaml(new URL("../schema/configSchema.yaml", import.meta.url));
    return ajv.compile(schema);
}

async function validateConfig(mods) {
    const validate = await validateFuncPromise;

    validate(mods);

    if (validate.errors !== null && validate.errors.length > 0) {
        const error = validate.errors[0];
        const validationError = new Error(error.dataPath + ": " + error.data + " " + error.message);
        validationError.name = "ValidationError";
        throw validationError;
    }

    return mods;
}

async function load(url) {
    const configSrc = await Fetcher.fetchYaml(url);
    const config = await validateConfig(configSrc);
    config.configUrl = url;
    config.configSrc = configSrc;
    return config;
}

export {load};
