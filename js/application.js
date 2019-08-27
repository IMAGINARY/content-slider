const _configOverridesPromises = {};

class Application {
    constructor(config = {}) {
        this._config = Object.assign(Application.defaultConfig, config);

        this._applicationReadyPromise = Promise.resolve();
        this._isReady = false;

        // the this.ready might be overwritten by a superclass, so we only query it after the stack has become empty
        Promise.resolve().then(() => this.ready.then(() => this._isReady = true));
    }

    static get defaultConfig() {
        return {
            appName: 'App name',
            appDescription: '',
            appCredits: '',
        };
    }

    static async retrieveConfigOverrides() {
        return Promise.resolve([]);
    }

    /***
     * This method returns an array of config overrides for the class in question.
     * The format is `{type:'..', config: {...}}`. `type` determines how to interpret the override such that an
     * application can check whether the override applies or not. If it does, `config` contains the properties
     * to override. Several overrides may or may not be combined when passing them to the class constructor.
     */
    static async getConfigOverrides() {
        if (typeof _configOverridesPromises[this.name] === 'undefined')
            _configOverridesPromises[this.name] = this.retrieveConfigOverrides(); // when overwritten in a subclass, it will be called on the subclass
        return _configOverridesPromises[this.name];
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
