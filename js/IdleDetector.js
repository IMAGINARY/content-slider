const defaultConstructorParams = {
    eventTypes: [
        'pointerdown',
        'pointermove',
        'pointerup',
        'pointercancel',
        'keydown',
        'keyup',
    ],
    domElement: document
};

class IdleDetector {

    constructor(params = {}) {
        const {eventTypes, domElement} = Object.assign(Object.assign({}, defaultConstructorParams), params);
        this._eventTypes = eventTypes;
        this._domElement = domElement;
        this._timeOfLastEvent = 0;
        this._maxId = 0;
        this._timers = {};
        this._nonIdleHandler = () => {
            this.reset();
        };
    }

    _init() {
        this._eventTypes.forEach(type => this._domElement.addEventListener(type, this._nonIdleHandler, true));
    }

    _deinit() {
        this._eventTypes.forEach(type => this._domElement.removeEventListener(type, this._nonIdleHandler, true));
    }

    setTimeout(func, timeoutDelay, ...args) {
        // event handlers should only be active if there are pending timeouts
        if (Object.keys(this._timers).length === 0)
            this._init();

        if (typeof timeoutDelay === 'undefined')
            timeoutDelay = 0;
        const id = this._maxId++;
        const timers = this._timers;
        const timer = {
            id: id,
            timeoutDelay: timeoutDelay,
            windowTimeoutId: 0,
            callback: () => func(...args),
            reset: function () {
                window.clearTimeout(this.windowTimeoutId);
                this.windowTimeoutId = window.setTimeout(() => this.callback(...args), this.timeoutDelay, this);
            },
            clear: function () {
                window.clearTimeout(this.windowTimeoutId);
                this.windowTimeoutId = 0;
            },
            delete: function () {
                this.clear();
                delete timers[id];
            }
        };
        timers[id] = timer;
        timer.reset();
        return id;
    }

    setInterval(func, intervalDelay, timeoutDelay, ...args) {
        // event handlers should only be active if there are pending timeouts
        if (Object.keys(this._timers).length === 0)
            this._init();

        if (typeof intervalDelay === 'undefined')
            intervalDelay = 0;
        if (typeof timeoutDelay === 'undefined')
            timeoutDelay = intervalDelay;
        const id = this._maxId++;
        const timers = this._timers;
        const timer = {
            id: id,
            timeoutDelay: timeoutDelay,
            intervalDelay: intervalDelay,
            windowTimeoutId: 0,
            windowIntervalId: 0,
            callback: () => func(...args),
            intervalCallback: function () {
                this.windowIntervalId = window.setInterval(this.callback, this.intervalDelay);
                this.callback();
            },
            reset: function () {
                window.clearTimeout(this.windowTimeoutId);
                window.clearInterval(this.windowIntervalId);
                this.windowTimeoutId = window.setTimeout(this.intervalCallback.bind(this), this.timeoutDelay);
            },
            clear: function () {
                window.clearTimeout(this.windowTimeoutId);
                window.clearInterval(this.windowIntervalId);
                this.windowTimeoutId = 0;
                this.windowIntervalId = 0;
            },
            delete: function () {
                this.clear();
                delete timers[id];
            }
        };
        timers[id] = timer;
        timer.reset();
        return id;
    }

    clearTimeout(id) {
        if (typeof this._timers[id] !== 'undefined')
            this._timers[id].delete();

        // event handlers should only be active if there are pending timeouts
        if (Object.keys(this._timers).length === 0)
            this._deinit();
    }

    clearInterval(id) {
        this.clearTimeout(id);
    }

    /***
     * Interrupt the idle state and restart the timeouts and intervals.
     */
    reset() {
        this._timeOfLastEvent = performance.now();
        Object.values(this._timers).forEach(timer => timer.reset());
    }

    /***
     * Clear all timeouts and intervals.
     */
    clear() {
        Object.values(this._timers).forEach(timer => timer.delete());
        this._deinit();
    }

    /***
     * Return the time in ms since the last interruption of the idle state
     * if there is at least one active (interval) timeout
     * registered. Otherwise returns -1;
     * @returns {number}
     */
    getIdleTime() {
        if (Object.keys(this._timers).length === 0)
            return -1;
        else
            return performance.now() - this._timeOfLastEvent;
    }
}

export {IdleDetector};