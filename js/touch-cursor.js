class Cursor {
    constructor(params) {
        this._isEnabled = false;
        this._createCursorElem = pointerEvent => {
            const cursor = document.createElement("div");
            cursor.className = 'debug_cursor';
            cursor.style.display = 'none';
            cursor.appendChild(params.createCursorElement(pointerEvent));
            return cursor;
        };
        this._parentElem = document.body;
        this._cursors = {};
        const that = this;

        function addCursor(pointerEvent) {
            if (typeof that._cursors[pointerEvent.pointerId] !== 'undefined') {
                return that._cursors[pointerEvent.pointerId];
            } else {
                const cursor = that._createCursorElem(pointerEvent);
                that._cursors[pointerEvent.pointerId] = cursor;
                that._parentElem.appendChild(cursor);
                return cursor;
            }
        }

        function removeCursor(pointerEvent) {
            if (typeof that._cursors[pointerEvent.pointerId] !== 'undefined') {
                const cursor = that._cursors[pointerEvent.pointerId];
                cursor.remove();
                delete that._cursors[pointerEvent.pointerId];
                if (typeof params.removeCursorElement === 'function')
                    params.removeCursorElement(cursor);
                return cursor;
            } else {
                return undefined;
            }
        }

        function moveCursor(cursor, x, y) {
            cursor.style.display = 'inline';
            cursor.style.top = y + "px";
            cursor.style.left = x + "px";
        }

        function debugPointerDown(pointerEvent) {
            const cursor = addCursor(pointerEvent);
            moveCursor(cursor, pointerEvent.pageX, pointerEvent.pageY);
            if (typeof params.downHandler === 'function')
                params.downHandler(cursor.firstChild, pointerEvent);
            return false;
        }

        function debugPointerMove(pointerEvent) {
            const cursor = addCursor(pointerEvent);
            moveCursor(cursor, pointerEvent.pageX, pointerEvent.pageY);
            if (typeof params.moveHandler === 'function')
                params.moveHandler(cursor.firstChild, pointerEvent);
            return false;
        }

        function debugPointerUp(pointerEvent) {
            let cursor = addCursor(pointerEvent);
            if (pointerEvent.pointerType !== 'mouse')
                cursor = removeCursor(pointerEvent);
            if (typeof params.upHandler === 'function')
                params.upHandler(cursor.firstChild, pointerEvent);
            return false;
        }

        this._handlers = {
            debugPointerDown: debugPointerDown,
            debugPointerMove: debugPointerMove,
            debugPointerUp: debugPointerUp,
        };
    }

    enable() {
        if (!this._isEnabled) {
            this._parentElem.addEventListener('pointerdown', this._handlers.debugPointerDown, true);
            this._parentElem.addEventListener('pointermove', this._handlers.debugPointerMove, true);
            this._parentElem.addEventListener('pointerup', this._handlers.debugPointerUp, true);
            this._isEnabled = true;
        }
    }

    disable() {
        if (this._isEnabled) {
            this._parentElem.removeEventListener('pointerdown', this._handlers.debugPointerDown, true);
            this._parentElem.removeEventListener('pointermove', this._handlers.debugPointerMove, true);
            this._parentElem.removeEventListener('pointerup', this._handlers.debugPointerUp, true);
            Object.getOwnPropertyNames(this._cursors).forEach(pointerId => this._cursors[pointerId].remove());
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
