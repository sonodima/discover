import { Application, BitmapText } from 'pixi.js'

import FontCache from "./FontCache";

class Renderer {
    private app: Application;
    private fontCache: FontCache;

    constructor() {
        // The application will create a renderer using WebGL, if possible,
        // with a fallback to a canvas render. It will also setup the ticker
        // and the root stage PIXI.Container.
        this.app = new Application({ resizeTo: window, backgroundAlpha: 0, sharedTicker: false });

        this.fontCache = new FontCache();

        document.querySelector<HTMLDivElement>('#app')?.appendChild(this.app.view);
    }

    drawString(content: string, family: string, fill: number, x: number, y: number, size: number) {
        this.fontCache.handle(family, fill, size);

        const text = new BitmapText(content, {
            fontName: this.fontCache.calculateId(family, fill, size),
        });
        text.position.set(x, y);

        this.app.stage.addChild(text);
    }

    test() {

        this.app.stage.removeChildren();

        for (var i = 0; i < 1; i++) {
            this.drawString("Hello World", "Arial", 0xffff00, 500 * Math.random(), 500 * Math.random(), 32);

            this.drawString("Hello World", "Impact", 0xff0000, 500 * Math.random(), 500 * Math.random(), 32);
        }



    }
}

export default Renderer;