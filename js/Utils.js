import '../vendor/js-yaml/3.13.1/js-yaml.min.js';
import '../vendor/whenzel/1.0.3/whenzel.js';
import '../vendor/ajv/6.10.2/ajv.min.js';

function handleHTTPError(response) {
    if (!response.ok) {
        const httpError = new Error(`HTTP error ${response.status}: ${response.statusText}`);
        httpError.name = 'HttpError';
        throw httpError;
    } else {
        return response;
    }
}

function fetchAndHandleError(url) {
    return fetch(url)
        .catch(err => {
            err.name = "FetchError";
            throw err;
        })
        .then(handleHTTPError);
}

function parseYaml(yaml, url) {
    const jsYamlOptions = {
        onWarning: w => console.warn("Warning while parsing YAML file:", w),
        schema: jsyaml.JSON_SCHEMA,
    };
    if (typeof url !== 'undefined')
        jsYamlOptions.filename = url;
    try {
        return jsyaml.safeLoad(yaml, jsYamlOptions);
    } catch (err) {
        err.name = "SyntaxError";
        throw err;
    }
}

class Fetcher {
    static async fetchText(url) {
        return await fetchAndHandleError(url)
            .then(async response => await response.text());
    }

    static async fetchJson(url) {
        return await fetchAndHandleError(url)
            .then(async response => await response.json());
    }

    static async fetchYaml(url) {
        return await fetchAndHandleError(url)
            .then(async response => parseYaml(await response.text(), url));
    }

    static addCacheBuster(url) {
        url = new URL(url);
        url.searchParams.append("cachebuster", Date.now());
        return url;
    }
}

class AjvUtils {
    static validateAndThrowOnError(subject, validateFunc) {
        validateFunc(subject);

        if (validateFunc.errors !== null && validateFunc.errors.length > 0) {
            const error = validateFunc.errors[0];
            const validationError = new Error(error.dataPath + ": " + error.data + " " + error.message);
            validationError.name = "ValidationError";
            throw validationError;
        }

        return subject;
    }

    /***
     * Creates a AJV validation function that utilized the supplied schema and additionally adds a new 'whenzel' string
     * format for validating Whenzel patterns.
     * @param jsonOrYamlSchemaUrl The URL the to schema to use for validation via AJV. Can point to a JSON or YAML file.
     */
    static async getValidateFunc(jsonOrYamlSchemaUrl) {
        const ajv = new Ajv({verbose: true, removeAdditional: true});

        // JSON is a subset of YAML, so we can safely use the YAML parser for both
        const schema = await Fetcher.fetchYaml(jsonOrYamlSchemaUrl);

        // Add a string format for Whenzel patterns
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
}

export {AjvUtils, Fetcher};
