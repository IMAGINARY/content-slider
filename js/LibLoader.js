const countdownJsPromise = fetch(new URL('../vendor/countdown.js/2.6.0/countdown.min.js', import.meta.url).href)
    .then(responde => responde.text())
    .then(scriptText => eval(scriptText + "; countdown;"));

async function countdownjs() {
    return await countdownJsPromise;
}

export {countdownjs};
