class Application {
    constructor() {
    }

    get ready() {
        return Promise.resolve();
    }

    get domElement() {
        if( typeof this._domElement === 'undefined')
            this._domElement = document.createElement('div');
        return this._domElement;
    }

    get name() {
        return 'Application'
    }

    get description() {
        return 'Application description.'
    }

    get credits() {
        return 'Application credits'
    }

    pause() {
    }

    resume() {
    }

    restart() {
    }
}

export default Application;
