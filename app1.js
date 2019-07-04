import Application from './js/application.js';

class CarParkIFrameApp extends Application {
    constructor() {
        super();

        const iframe = document.createElement('iframe');
        this._readyPromise = new Promise(resolve => iframe.addEventListener('load', () => resolve(this)));

        iframe.src = 'http://science-to-touch.com/Mathematikon/dmweb/content/G4/Widget.html?';
        iframe.style.width = '100%';
        iframe.style.height = '100%';

        this._iframe = iframe;
    }

    get ready() {
        return this._readyPromise;
    }

    get domElement() {
        return this._iframe;
    }

    get name() {
        return this.constructor.name;
    }

    get description() {
        return 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.';
    }

    get credits() {
        return 'Author 2a<br/>Author 2b';
    }

    pause() {
        console.log(`pause ${this.constructor.name}`);
    }

    resume() {
        console.log(`resume ${this.constructor.name}`);
    }

    restart(pauseAfterRestart) {
        console.log(`restart ${this.constructor.name}`);
        this._iframe.src += 'a';
    }
}

export default CarParkIFrameApp;
