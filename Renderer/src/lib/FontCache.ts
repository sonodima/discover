import { BitmapFont } from "pixi.js"

class FontCache {
    private cachedList: string[];

    constructor() {
        this.cachedList = [];
    }

    calculateId(font: string, color: number, size: number) {
        return `${font}-${color}-${size}`;
    }

    private registerFont(font: string, color: number, size: number) {
        const id = this.calculateId(font, color, size);

        BitmapFont.from(id, {
            fontFamily: font,
            fill: color,
            fontSize: size
        }, {
            chars: BitmapFont.ALPHA
        });

        this.cachedList.push(id);
    }

    handle(font: string, color: number, size: number) {
        const id = this.calculateId(font, color, size);

        if (!this.cachedList.includes(id)) {
            this.registerFont(font, color, size);
        }
    }
}

export default FontCache;