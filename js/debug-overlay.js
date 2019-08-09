import Cursor from './touch-cursor.js';

class DebugOverlay {
    constructor(params) {
        this._isEnabled = false;
        this._parentElem = document.body;
        this._eventNum = 0;

        const mouseColor = 'white';
        const touchColors = ['Gold', 'DodgerBlue', 'Crimson', 'LimeGreen', 'OrangeRed', 'DeepPink'];

        this._cursorVisualizer = new Cursor({
            createCursorElement: pointerEvent => {
                const type = pointerEvent.pointerType.substr(0, 1).toUpperCase();
                const id = pointerEvent.pointerId;
                const color = pointerEvent.pointerType === 'mouse' ? mouseColor : touchColors[pointerEvent.pointerId % touchColors.length];
                const cursor = document.createElement('div');
                cursor.innerHTML = '<svg style="transform: translate(-25%, -50%);"><circle cx="75" cy="75" r="40" stroke="black" stroke-width="3" fill="' + color + '" fill-opacity="0.5"/><line x1="0" y1="75" x2="150" y2="75" stroke="black" stroke-width="3" /><line x1="75" y1="0" x2="75" y2="150" stroke="black" stroke-width="3" /><line x1="0" y1="75" x2="150" y2="75" stroke="white" stroke-width="1" /><line x1="75" y1="0" x2="75" y2="150" stroke="white" stroke-width="1"/><text x="0" y="30" fill="black" style="font-size: 30px; fill: white; stroke: black; stroke-width: 2px; stroke-linecap: butt; stroke-linejoin: miter;">' + type + '</text><text x="150" y="30" fill="black" text-anchor="end" style="font-size: 30px; fill: white; stroke: black; stroke-width: 2px; stroke-linecap: butt; stroke-linejoin: miter;">' + id + '</text><text x="150" y="140" fill="black" text-anchor="end" style="font-size: 30px; fill: white; stroke: black; stroke-width: 2px; stroke-linecap: butt; stroke-linejoin: miter;">' + type + '</text><text x="0" y="140" fill="black" style="font-size: 30px; fill: white; stroke: black; stroke-width: 2px; stroke-linecap: butt; stroke-linejoin: miter;">' + id + '</text></svg>';
                cursor.style.opacity = '0.25';
                cursor.style.transform = 'scale( ' + params.debugCursorScale + ' )';
                cursor.style.transformOrigin = '0% 0%';
                return cursor;
            },
            downHandler: cursor => cursor.style.opacity = '1.0',
            upHandler: cursor => cursor.style.opacity = '0.25',
        });
        this._debugConsole = (() => {
            const debugConsole = document.createElement("div");
            debugConsole.className = 'debug_console';
            return debugConsole;
        })();
        this._logFunc = event => this.logEvent(event, 'white' /* TODO */);
    }

    log(text, color, object) {
        const item = document.createElement('span');
        item.style.color = color;
        item.innerHTML = text;
        this._debugConsole.insertBefore(document.createElement('br'), this._debugConsole.firstChild);
        this._debugConsole.insertBefore(item, this._debugConsole.firstChild);
        while (this._debugConsole.childNodes.length > 500)
            this._debugConsole.removeChild(this._debugConsole.lastChild);
        console.log(object);
    }

    logEvent(event, color) {
        let text = `#${this._eventNum++}: ${event.type}`;
        if (event.type.startsWith('touch'))
            for (let i = 0; i < event.changedTouches.length; ++i)
                text += ' ' + event.changedTouches[i].identifier;
        this.log(text, color, event);
    }

    enable() {
        if (!this._isEnabled) {
            this._parentElem.addEventListener('mousedown', this._logFunc, true);
            this._parentElem.addEventListener('mousemove', this._logFunc, true);
            this._parentElem.addEventListener('mouseup', this._logFunc, true);

            this._parentElem.addEventListener('touchstart', this._logFunc, true);
            this._parentElem.addEventListener('touchmove', this._logFunc, true);
            this._parentElem.addEventListener('touchend', this._logFunc, true);

            this._parentElem.appendChild(this._debugConsole);
            this._cursorVisualizer.enable();

            this._isEnabled = true;
        }
    }

    disable() {
        if (this._isEnabled) {
            this._parentElem.removeEventListener('mousedown', this._logFunc, true);
            this._parentElem.removeEventListener('mousemove', this._logFunc, true);
            this._parentElem.removeEventListener('mouseup', this._logFunc, true);

            this._parentElem.removeEventListener('touchstart', this._logFunc, true);
            this._parentElem.removeEventListener('touchmove', this._logFunc, true);
            this._parentElem.removeEventListener('touchend', this._logFunc, true);

            this._cursorVisualizer.disable();
            this._debugConsole.remove();

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

    clear() {
        this._debugConsole.innerHTML = '';
    }
}

export default DebugOverlay;
