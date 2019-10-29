import {IdleDetector} from './IdleDetector.js';

class ReloadButtons {
    constructor(params) {
        this._isEnabled = false;
        this._parentElem = params.parentElement;
        this._reloadButtonSize = params.reloadButtonSize;
        this._reloadButtonHoldTime = params.reloadButtonHoldTime * 1000;

        const dblClickHandler = () => Reloader.fadeOutAndReload();
        const pointerDownHandler = event => event.target.pressTimeout = setTimeout(() => Reloader.fadeOutAndReload(), this._reloadButtonHoldTime);
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

class Reloader {
    static reload() {
        window.location.reload(true);
    }

    static fadeOutAndReload(element = window.document.body) {
        element.style.animationsDelay = '0s';
        element.style.animation = "";
        element.className = "fade-out";
        element.addEventListener('animationend', ae => ae.animationName === 'fadeOut' ? Reloader.reload() : false);
        element.style.animationPlayState = 'running';
    }

    static reloadAtMidNight() {
        const now = new Date();
        const midnight = new Date(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() + 86400000);
        const midnightOffset = 1 * 1000 /* 1s */;
        setTimeout(() => Reloader.fadeOutAndReload(), midnight - now + midnightOffset);
    }
}

class IdleReloader extends Reloader {
    constructor(params) {
        super();
        this._isEnabled = false;
        this._reloadTimeThreshold = params.reloadDelay * 1000;
        this._idleDetector = null;
    }

    enable() {
        if (!this._isEnabled) {
            console.log("reloading page after " + Math.floor(this._reloadTimeThreshold / 1000.0) + "s in idle mode");
            this._idleDetector = new IdleDetector();
            this._idleDetector.setTimeout(() => Reloader.fadeOutAndReload(), this._reloadTimeThreshold);

            this._isEnabled = true;
        }
    }

    disable() {
        if (this._isEnabled) {
            this._idleDetector.clear();
            this._idleDetector = null;

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

class ErrorReloader extends Reloader {
    constructor(params) {
        super();
        this._isEnabled = false;
        this._reloadDelay = params.reloadDelay * 1000;
        this._reloadTimeout = 0;
        this._errorEventListener = error => {
            if (this._reloadTimeout === 0) {
                // schedule a reload only if it hasn't been scheduled already
                console.warn(`An error occurred. Reloading page in ${this._reloadDelay / 1000}s. Call window.abortReload() to prevent this.`);
                this._reloadTimeout = setTimeout(() => Reloader.fadeOutAndReload(), this._reloadDelay);
                window.abortReload = () => {
                    clearTimeout(this._reloadTimeout);
                    this._reloadTimeout = 0;
                    delete window.abortReload;
                    console.warn('Scheduled page reloading aborted.');
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

export {Reloader, ReloadButtons, IdleReloader, ErrorReloader};
