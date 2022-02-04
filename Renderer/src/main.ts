import Log from './log';

import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <canvas id="glcanvas">This environment does not support canvas</canvas>
`

const log = new Log();

const initializeRenderer = (): boolean => {
    const canvas = document.querySelector<HTMLCanvasElement>('#glcanvas');
    if (!canvas) {
        log.write('local', "Could not obtain canvas");
        return false;
    }

    const gl = canvas.getContext("webgl2");
    if (!gl) {
        log.write('local', "Could not obtain webgl2 context from canvas");
        return false;
    }

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    gl.clearColor(1.0, 0, 0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    return true;
}

const resize = () => {

}


initializeRenderer();