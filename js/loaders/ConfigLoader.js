import {AjvUtils, Fetcher} from '../Utils.js';

let validateFuncPromise = AjvUtils.getValidateFunc(new URL("../../schema/config.schema.yaml", import.meta.url));

async function load(url, allowUrlParamOverrides) {
    if (typeof allowUrlParamOverrides === 'undefined')
        allowUrlParamOverrides = false;

    const yaml = await Fetcher.fetchYaml(url);
    const config = await validate(yaml);
    config.configUrl = url;

    if (allowUrlParamOverrides) {
        const allConfigProperties = (await validateFuncPromise).schema.properties;
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.forEach((value, key) => {
            if (typeof allConfigProperties[key] !== 'undefined') {
                // process only known properties
                if (allConfigProperties[key]['cfg-overridable']) {
                    switch (allConfigProperties[key]['type']) {
                        case 'boolean':
                            config[key] = Boolean(value);
                            break;
                        case 'number':
                        case 'integer':
                            config[key] = Number(value);
                            break;
                        case 'string':
                        default:
                            config[key] = value;
                            break;
                    }
                } else {
                    const error = new Error("Unable to override non-overridable property");
                    error.name = "OverrideError";
                    throw error;
                }
            }
        });
    }

    return config;
}

async function validate(config) {
    return await AjvUtils.validateAndThrowOnError(config, await validateFuncPromise);
}

export {load, validate};
