class Application {
    static defaultConfig = {
        appName: 'App name',
        appDescription: '',
        appCredits: '',
    };

    constructor(config = {}) {
        this._config = Object.assign(Application.defaultConfig, config);

        this._applicationReadyPromise = Promise.resolve();
        this._isReady = false;

        // the this.ready might be overwritten by a superclass, so we only query it after the stack has become empty
        Promise.resolve().then(() => this.ready.then(() => this._isReady = true));
    }

    get isReady() {
        return this._isReady;
    }

    get ready() {
        return this._applicationReadyPromise;
    }

    get domElement() {
        if (typeof this._domElement === 'undefined')
            this._domElement = document.createElement('div');
        return this._domElement;
    }

    get config() {
        return this._config;
    }

    get name() {
        return this._config.appName;
    }

    get description() {
        return this._config.appDescription;
    }

    get credits() {
        return this._config.appCredits;
    }

    pause() {
        if (this.isReady) {
            console.log(`pausing ${this.constructor.name}`);
        } else {
            console.log(`pausing ${this.constructor.name} failed, because app is not ready yet`);
        }
    }

    resume() {
        if (this.isReady) {
            console.log(`resuming ${this.constructor.name}`);
        } else {
            console.log(`resuming ${this.constructor.name} failed, because app is not ready yet`);
        }
    }

    reset() {
        if (this.isReady) {
            console.log(`resetting ${this.constructor.name}`);
        } else {
            console.log(`resetting ${this.constructor.name} failed, because app is not ready yet`);
        }
    }

    restart(pauseAfterRestart) {
        this.reset();
        if (pauseAfterRestart)
            this.pause();
        else
            this.resume();
    }
}

export default Application;
