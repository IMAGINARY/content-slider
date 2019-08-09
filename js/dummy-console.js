class DummyConsole {
    static _noop = () => undefined;
    static _realConsole = window.console;
    static _dummyConsole = {
        log: DummyConsole._noop,
        debug: DummyConsole._noop,
        info: DummyConsole._noop,
        warn: DummyConsole._noop,
        error: DummyConsole._noop,
    };

    static enable() {
        this.setEnabled(true);
    }

    static disable() {
        this.setEnabled(false);
    }

    static setEnabled(enable) {
        DummyConsole._realConsole.log("Console logging " + (enable ? "disabled" : "enabled"));
        window.console = enable ? DummyConsole._dummyConsole : DummyConsole._realConsole;
    }

    static isEnabled() {
        return window.console === _dummyConsole;
    }
}

export default DummyConsole;
