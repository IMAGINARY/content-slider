import '../vendor/js-yaml/3.13.1/js-yaml.min.js';

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
}

export {Fetcher};
