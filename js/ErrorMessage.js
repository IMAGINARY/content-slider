let lastTimeout = 0;
let errorDiv = document.getElementById('error-message');

function hideMsg() {
    errorDiv.style.display = 'none';
}

function errorMsg(message, options) {
    const defaultOptions = {
        duration: 10 * 1000,
    };
    options = Object.assign(defaultOptions, options);
    errorDiv.innerText = message;
    errorDiv.style.display = 'block';
    window.clearTimeout(lastTimeout);
    lastTimeout = setTimeout(hideMsg, options.duration);
}

export {errorMsg};
