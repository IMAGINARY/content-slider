import Application from './js/application.js';

class CounterApp extends Application {
    constructor() {
        super();
        const div = document.createElement("div");
        div.style.fontSize = '64px';
        div.style.color = '#' + Math.floor(Math.random() * 16777215).toString(16);

        this._domElement = div;

        this._number = 0;
        this._timeout = 0;
    }

    _animate() {
        this._render();
        this._number++;
        this._requestAnimation();
    }

    _render() {
        this.domElement.innerHTML = this._number;
    }

    _requestAnimation() {
        clearTimeout(this._timeout);
        this._timeout = window.setTimeout(this._animate.bind(this), 1000);
    }

    get ready() {
        return Promise.resolve(this);
    }

    get domElement() {
        return this._domElement;
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
        window.clearTimeout(this._timeout);
        this._timeout = 0;
    }

    resume() {
        console.log(`resume ${this.constructor.name}`);
        if (this._timeout === 0)
            this._requestAnimation();
    }

    restart(pauseAfterRestart) {
        console.log(`restart ${this.constructor.name}`);
        this._number = 0;
        this._render();
        if (!pauseAfterRestart && this._timeout === 0)
            this._requestAnimation();
    }
}

export default CounterApp;
