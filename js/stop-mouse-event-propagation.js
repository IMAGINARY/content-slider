class MouseEventSupporessor {
    constructor() {
        this._isEnabled = false;
        this._parentElem = document.body;
        this._stopEventPropagation = event => event.stopImmediatePropagation();
    }

    enable() {
        if (!this._isEnabled) {
            this._parentElem.addEventListener('mousedown', this._stopEventPropagation, true);
            this._parentElem.addEventListener('mousemove', this._stopEventPropagation, true);
            this._parentElem.addEventListener('mouseup', this._stopEventPropagation, true);

            // maybe not needed, but added to be on the safe side
            this._parentElem.addEventListener('click', this._stopEventPropagation, true);
            this._parentElem.addEventListener('dblclick', this._stopEventPropagation, true);
            this._isEnabled = true;
        }
    }

    disable() {
        if (this._isEnabled) {
            this._parentElem.removeEventListener('mousedown', this._stopEventPropagation, true);
            this._parentElem.removeEventListener('mousemove', this._stopEventPropagation, true);
            this._parentElem.removeEventListener('mouseup', this._stopEventPropagation, true);
            this._parentElem.removeEventListener('click', this._stopEventPropagation, true);
            this._parentElem.removeEventListener('dblclick', this._stopEventPropagation, true);
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
