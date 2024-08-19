import {
  Assets,
  ColorMatrix,
  ColorMatrixFilter,
  Container,
  Sprite,
  Texture,
} from "pixi.js";
import { Constructor } from "./constructor";
import { convertToKebabCase } from "./util";

export declare class Iconable {
  createSprites(
    gateType: string,
    sizeInPx: number
  ): Promise<{
    sprite: Sprite;
    whiteSprite: Sprite;
  }>;
}

const WHITE_FILTER_MATRIX = [
  0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0,
] as ColorMatrix;

export function IconableMixin<TBase extends Constructor<Container>>(
  Base: TBase
): Constructor<Iconable> & TBase {
  return class IconableMixinClass extends Base {
    sprite!: Sprite;
    whiteSprite!: Sprite;

    async createSprites(gateType: string, sizeInPx: number) {
      const texture = await this.loadTexture(gateType);
      const sprite = this.createSprite(texture, sizeInPx);
      const whiteSprite = this.createWhiteSprite(texture, sizeInPx);

      return { sprite: sprite, whiteSprite: whiteSprite };
    }

    private async loadTexture(gateType: string): Promise<Texture> {
      const iconName = `${convertToKebabCase(gateType)}.png`;
      const iconPath = `./assets/${iconName}`;
      return await Assets.load(iconPath);
    }

    private createSprite(texture: Texture, sizeInPx: number): Sprite {
      const sprite = new Sprite(texture);
      sprite.width = sizeInPx;
      sprite.height = sizeInPx;
      return sprite;
    }

    private createWhiteSprite(texture: Texture, sizeInPx: number): Sprite {
      const whiteSprite = new Sprite(texture);
      const whiteFilter = new ColorMatrixFilter();
      whiteFilter.matrix = WHITE_FILTER_MATRIX;
      whiteSprite.visible = false;
      whiteSprite.filters = [whiteFilter];
      whiteSprite.width = sizeInPx;
      whiteSprite.height = sizeInPx;
      return whiteSprite;
    }
  };
}
