import { Application, BitmapText, Graphics } from 'pixi.js'

import FontCache from './FontCache';

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

    drawString(content: string, family: string, color: number, x: number, y: number, size: number) {
        this.fontCache.handle(family, color, size);

        const text = new BitmapText(content, {
            fontName: this.fontCache.calculateId(family, color, size),
        });
        text.position.set(x, y);

        this.app.stage.addChild(text);
    }

    drawRect(x: number, y: number, width: number, height: number, color: number,
        fill: boolean = true, thickness: number = 2, radius: number = 0, alpha: number = 1) {
        var graphics = new Graphics(); // todo create only one instance of graphics per instruction list

        if (fill) {
            graphics.beginFill(color, alpha);
            graphics.lineStyle(0);
        } else {
            graphics.lineStyle(thickness, color, alpha);
        }

        if (radius > 0) {
            graphics.drawRoundedRect(x, y, width, height, radius);
        } else {
            graphics.drawRect(x, y, width, height);
        }

        if (fill) {
            graphics.endFill();
        }

        this.app.stage.addChild(graphics);
    }
}

export default Renderer;