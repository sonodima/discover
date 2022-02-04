import Log from "./log";

class Renderer {
    private log: Log;
    private canvas: HTMLCanvasElement;
    private gl: WebGL2RenderingContext | null | undefined;

    constructor(log: Log) {
        this.log = log;

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'glcanvas';
        this.canvas.innerText = 'This environment does not support canvas';

        document.querySelector<HTMLDivElement>('#app')?.appendChild(this.canvas);
    }

    intialize(): boolean {
        this.gl = this.canvas.getContext("webgl2");
        if (!this.gl) {
            this.log.write('local', "Could not obtain WebGL2 context from canvas");
            return false;
        }

        this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);

        this.gl.clearColor(1.0, 0, 0, 1.0);

        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        return true;
    }
}

export default Renderer;