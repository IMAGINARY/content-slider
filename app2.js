import Application from './js/application.js';

class RaytracerApp extends Application {
    constructor() {
        super();

        const object = document.createElement('object');
        object.type = 'text/html';
        object.data = 'http://science-to-touch.com/CJS/test/science/cindygl-demo/06_raytracer_bisection.html?';
        object.style.width = '100%';
        object.style.height = '100%';

        this._object = object;
    }

    get ready() {
        return Promise.resolve(this);
    }

    get domElement() {
        return this._object;
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
        this._object.src += 'a';
    }
}

export default RaytracerApp;

