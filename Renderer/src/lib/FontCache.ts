import { BitmapFont } from 'pixi.js'

class FontCache {
    private cachedList: string[];

    constructor() {
        this.cachedList = [];
    }

    calculateId(family: string, color: number, size: number) {
        return `${family}-${color}-${size}`;
    }

    private registerFont(family: string, color: number, size: number) {
        const id = this.calculateId(family, color, size);

        BitmapFont.from(id, {
            fontFamily: family,
            fill: color,
            fontSize: size
        }, {
            chars: BitmapFont.ALPHA
        });

        this.cachedList.push(id);
    }

    handle(family: string, color: number, size: number) {
        const id = this.calculateId(family, color, size);

        if (!this.cachedList.includes(id)) {
            this.registerFont(family, color, size);
        }
    }
}

export default FontCache;