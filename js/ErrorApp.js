import Application from './application.js';

class ErrorApp extends Application {
    constructor(errorMessage) {
        super();
        this._errorMessage = errorMessage;
        this._domElement = document.createElement('div');
        this._domElement.style.backgroundColor = 'red';
        this._domElement.style.width = '100%';
        this._domElement.style.height = '100%';
    }

    get ready() {
        return Promise.resolve(this);
    }

    get domElement() {
        return this._domElement;
    }

    get name() {
        return 'Error';
    }

    get description() {
        return this._errorMessage;
    }
}

export default ErrorApp;
