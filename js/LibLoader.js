import {Fetcher} from './Utils.js';

const countdownJsPromise = Fetcher.fetchText(new URL('../vendor/countdown.js/2.6.0/countdown.min.js', import.meta.url).href)
    .then(scriptText => eval(scriptText + "; countdown;"));

async function countdownjs() {
    return await countdownJsPromise;
}

export {countdownjs};
