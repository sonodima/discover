import {Application, BitmapText, Graphics} from "pixi.js"

import FontCache from "./FontCache";

import type {RectangleInstructionData, StringInstructionData} from "../types/instructions";

class Renderer {
    private app: Application;
    private fontCache: FontCache;

    constructor() {
        // The application will create a renderer using WebGL, if possible,
        // with a fallback to a canvas render. It will also setup the ticker
        // and the root stage PIXI.Container.
        this.app = new Application({resizeTo: window, backgroundAlpha: 0, sharedTicker: false});

        this.fontCache = new FontCache();

        document.querySelector<HTMLDivElement>("#app")?.appendChild(this.app.view);
    }

    drawString(data: StringInstructionData) {
        this.fontCache.handle(data.font, data.color, data.size);

        const text = new BitmapText(data.content, {
            fontName: this.fontCache.calculateId(data.font, data.color, data.size),
        });
        text.position.set(data.x, data.y);
        text.alpha = data.alpha;

        this.app.stage.addChild(text);
    }

    drawRect(data: RectangleInstructionData) {
        const graphics = new Graphics(); // todo create only one instance of graphics per instruction list

        if (data.fill) {
            graphics.beginFill(data.color, data.alpha);
            graphics.lineStyle(0);
        } else {
            graphics.lineStyle(data.thickness, data.color, data.alpha);
        }

        if (data.radius > 0) {
            graphics.drawRoundedRect(data.x, data.y, data.width, data.height, data.radius);
        } else {
            graphics.drawRect(data.x, data.y, data.width, data.height);
        }

        if (data.fill) {
            graphics.endFill();
        }

        this.app.stage.addChild(graphics);
    }

    clear() {
        this.app.stage.removeChildren();
    }
}

export default Renderer;