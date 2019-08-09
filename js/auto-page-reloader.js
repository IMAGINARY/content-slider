class ReloadButtons {
    constructor(params) {
        this._isEnabled = false;
        this._parentElem = params.parentElement;
        this._reloadButtonSize = params.reloadButtonSize;
        this._reloadButtonHoldTime = params.reloadButtonHoldTime * 1000;

        const fadeOutHandler = this.fadeOutAndReload.bind(this);
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

    fadeOutAndReload() {
        this._parentElem.style.animationsDelay = '0s';
        this._parentElem.style.animation = "";
        this._parentElem.className = "fade-out";
        setTimeout(() => location.reload(), 1500);
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
            this._idleTimer = setTimeout(this.fadeOutAndReload.bind(this), this._idleTimeThreshold);
        }
    }

    fadeOutAndReload() {
        document.body.style.animationsDelay = '0s';
        document.body.style.animation = "";
        document.body.className = "fade-out";
        setTimeout(() => location.reload(), 1500);
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

export {ReloadButtons, IdleReloader};
