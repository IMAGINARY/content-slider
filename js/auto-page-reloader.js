function fadeOutAndReload(element) {
    element.style.animationsDelay = '0s';
    element.style.animation = "";
    element.className = "fade-out";
    element.addEventListener('animationend', ae => ae.animationName === 'fadeOut' ? window.location.reload() : false);
    element.style.animationPlayState = 'running';
}

class ReloadButtons {
    constructor(params) {
        this._isEnabled = false;
        this._parentElem = params.parentElement;
        this._reloadButtonSize = params.reloadButtonSize;
        this._reloadButtonHoldTime = params.reloadButtonHoldTime * 1000;

        const fadeOutHandler = () => fadeOutAndReload(this._parentElem);
        const dblClickHandler = fadeOutHandler;
        const pointerDownHandler = event => event.target.pressTimeout = setTimeout(fadeOutHandler, this._reloadButtonHoldTime);
        const pointerUpHandler = event => clearTimeout(event.target.pressTimeout) && false;

        this._tl = document.createElement("div");
        this._tl.className = "reload_button bl";
        this._tl.style.width = this._reloadButtonSize;
        this._tl.style.height = this._reloadButtonSize;
        this._tl.addEventListener('dblclick', dblClickHandler);
        this._tl.addEventListener('pointerdown', pointerDownHandler);
        this._tl.addEventListener('pointerup', pointerUpHandler);

        this._tr = document.createElement("div");
        this._tr.className = "reload_button br";
        this._tr.style.width = this._reloadButtonSize;
        this._tr.style.height = this._reloadButtonSize;
        this._tr.addEventListener('dblclick', dblClickHandler);
        this._tr.addEventListener('pointerdown', pointerDownHandler);
        this._tr.addEventListener('pointerup', pointerUpHandler);
    }

    enable() {
        if (!this._isEnabled) {
            this._parentElem.appendChild(this._tl);
            this._parentElem.appendChild(this._tr);
            this._isEnabled = true;
        }
    }

    disable() {
        if (this._isEnabled) {
            clearTimeout(this._tl.pressTimeout);
            clearTimeout(this._tr.pressTimeout);
            this._tl.remove();
            this._tr.remove();
            this._isEnabled = false;
        }
    }

    setEnabled(enable) {
        if (enable)
            this.enable();
        else
            this.disable();
    }

    isEnabled() {
        return this._isEnabled;
    }
}

class IdleReloader {
    constructor(params) {
        this._isEnabled = false;
        this._reloadTimeThreshold = params.reloadDelay * 1000;
        this._idleTimeThreshold = params.idleDelay * 1000;
        this._thresholdTimer = 0;
        this._idleTimer = 0;

        this._nonIdleHandler = () => {
            console.log("non_idle_handler for reload");
            clearTimeout(this._idleTimer);
            this._idleTimer = setTimeout(() => fadeOutAndReload(document.body), this._idleTimeThreshold);
        }
    }

    enable() {
        if (!this._isEnabled) {
            setTimeout(() => {
                    console.log("reloading page after " + Math.floor(this._idleTimeThreshold / 1000.0) + "s in idle mode");

                    this._nonIdleHandler();

                    document.addEventListener('mouseup', this._nonIdleHandler, true);
                    document.addEventListener('mousemove', this._nonIdleHandler, true);
                    document.addEventListener('mousedown', this._nonIdleHandler, true);
                    document.addEventListener("touchstart", this._nonIdleHandler, true);
                    document.addEventListener("touchend", this._nonIdleHandler, true);
                    document.addEventListener("touchcancel", this._nonIdleHandler, true);
                    document.addEventListener("touchmove", this._nonIdleHandler, true);
                },
                this._reloadTimeThreshold
            );
            this._isEnabled = true;
        }
    }

    disable() {
        if (this._isEnabled) {
            clearTimeout(this._thresholdTimer);
            clearTimeout(this._idleTimer);
            this._thresholdTimer = 0;
            this._idleTimer = 0;

            document.removeEventListener('mouseup', this._nonIdleHandler, true);
            document.removeEventListener('mousemove', this._nonIdleHandler, true);
            document.removeEventListener('mousedown', this._nonIdleHandler, true);
            document.removeEventListener("touchstart", this._nonIdleHandler, true);
            document.removeEventListener("touchend", this._nonIdleHandler, true);
            document.removeEventListener("touchcancel", this._nonIdleHandler, true);
            document.removeEventListener("touchmove", this._nonIdleHandler, true);

            this._isEnabled = false;
        }
    }

    setEnabled(enable) {
        if (enable)
            this.enable();
        else
            this.disable();
    }

    isEnabled() {
        return this._isEnabled;
    }
}

class ErrorReloader {
    constructor(params) {
        this._isEnabled = false;
        this._reloadDelay = params.reloadDelay * 1000;
        this._reloadTimeout = 0;
        this._errorEventListener = error => {
            if (this._reloadTimeout === 0) {
                // schedule a reload only if it hasn't been scheduled already
                console.warn(`An error occurred. Reloading page in ${this._reloadDelay / 1000}s. Call window.abortReload() to prevent this.`);
                this._reloadTimeout = setTimeout(() => fadeOutAndReload(document.body), this._reloadDelay);
                window.abortReload = () => {
                    clearTimeout(this._reloadTimeout);
                    this._reloadTimeout = 0;
                    delete window.abortReload;
                };
            }
        };
    }

    enable() {
        if (!this._isEnabled) {
            window.addEventListener('error', this._errorEventListener, true);
            this._isEnabled = true;
        }
    }

    disable() {
        if (this._isEnabled) {
            window.removeEventListener('error', this._errorEventListener, true);
            if (typeof window.abortReload !== 'undefined')
                window.abortReload();
            this._isEnabled = false;
        }
    }

    setEnabled(enable) {
        if (enable)
            this.enable();
        else
            this.disable();
    }

    isEnabled() {
        return this._isEnabled;
    }
}

export {ReloadButtons, IdleReloader, ErrorReloader};
