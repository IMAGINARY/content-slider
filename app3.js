import Application from './js/application.js';

class PaintApp extends Application {
    constructor() {
        super();

        const div = document.createElement('div');
        div.style.width = '100%';
        div.style.height = '100%';

        const canvas = document.createElement("canvas");
        div.appendChild(canvas);

        const c = canvas.getContext('2d');

        const paintColors = {};
        const mouseId = 'mouse';

        let mouseDown = false;

        function addMouseListeners() {
            div.addEventListener('mousemove', function (e) {
                if (mouseDown) {
                    c.fillStyle = paintColors[mouseId];
                    const x = e.clientX - div.getBoundingClientRect().left;
                    const y = e.clientY - div.getBoundingClientRect().top;
                    drawCircle(x, y);
                }
            });

            div.addEventListener('mousedown', function (e) {
                mouseDown = true;
                setRandomPaintColor(mouseId);
            });

            div.addEventListener('mouseup', function (e) {
                mouseDown = false;
            });

            div.addEventListener('dblclick', function (e) {
                c.fillStyle = 'black';
                c.fillRect(0, 0, canvas.width, canvas.height);
            });
        }

        function setRandomPaintColor(id) {
            function rand255() {
                return Math.floor(Math.random() * 255);
            }

            paintColors[id] = 'rgb(' + rand255() + ',' + rand255() + ',' + rand255() + ')';
        }

        function drawCircle(x, y) {
            if (canvas.width !== div.getBoundingClientRect().width)
                canvas.width = div.getBoundingClientRect().width;
            if (canvas.height !== div.getBoundingClientRect().height)
                canvas.height = div.getBoundingClientRect().height;

            c.beginPath();
            c.arc(x, y, 20, 0, 2 * Math.PI);
            c.fill();
        }

        function addMultiTouchListeners() {
            div.addEventListener('touchmove', e => {
                setRandomPaintColor();
                for (let touch of e.changedTouches) {
                    c.fillStyle = paintColors[touch.identifier];
                    const x = touch.clientX - div.getBoundingClientRect().left;
                    const y = touch.clientY - div.getBoundingClientRect().top;
                    drawCircle(x, y);
                }
            });

            div.addEventListener('touchstart', e => {
                for (let touch of e.changedTouches)
                    setRandomPaintColor(touch.identifier);
            });

            div.addEventListener('touchend', e => {
                for (let touch of e.changedTouches)
                    delete paintColors[touch.identifier];
            });
        }

        addMouseListeners();
        addMultiTouchListeners();

        this._div = div;
        this._canvas = canvas;
        this._context = c;
    }

    get ready() {
        return Promise.resolve(this);
    }

    get domElement() {
        return this._div;
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
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
}

export default PaintApp;
