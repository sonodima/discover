import { BitmapFont } from 'pixi.js'

class FontCache {
    private cachedList: string[];

    constructor() {
        this.cachedList = [];
    }

    calculateId(family: string, fill: number, size: number) {
        return `${family}-${fill}-${size}`;
    }

    private registerFont(family: string, fill: number, size: number) {
        const id = this.calculateId(family, fill, size);

        BitmapFont.from(id, {
            fontFamily: family,
            fill: fill,
            fontSize: size
        }, {
            chars: BitmapFont.ALPHA
        });

        this.cachedList.push(id);
    }

    handle(family: string, fill: number, size: number) {
        const id = this.calculateId(family, fill, size);

        if (!this.cachedList.includes(id)) {
            this.registerFont(family, fill, size);
        }
    }
}

export default FontCache;