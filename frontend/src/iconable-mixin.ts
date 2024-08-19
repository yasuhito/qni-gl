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
  sprite: Sprite;
  whiteSprite: Sprite;
  loadTextures(gateType: string, sizeInPx: number): Promise<void>;
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

    async loadTextures(gateType: string, sizeInPx: number) {
      try {
        const texture = await this.loadTexture(gateType);
        this.createSprites(texture, sizeInPx);
      } catch (error) {
        console.error(`Failed to load texture: ${gateType}`, error);
      }
    }

    private async loadTexture(gateType: string): Promise<Texture> {
      const iconName = `${convertToKebabCase(gateType)}.png`;
      const iconPath = `./assets/${iconName}`;
      return await Assets.load(iconPath);
    }

    private createSprites(texture: Texture, sizeInPx: number) {
      this.sprite = this.createSprite(texture, sizeInPx);
      this.whiteSprite = this.createWhiteSprite(texture, sizeInPx);
    }

    private createSprite(texture: Texture, sizeInPx: number): Sprite {
      const sprite = new Sprite(texture);
      this.addChild(sprite);
      sprite.width = sizeInPx;
      sprite.height = sizeInPx;
      return sprite;
    }

    private createWhiteSprite(texture: Texture, sizeInPx: number): Sprite {
      const whiteSprite = new Sprite(texture);
      const whiteFilter = new ColorMatrixFilter();
      whiteFilter.matrix = WHITE_FILTER_MATRIX;
      this.addChild(whiteSprite);
      whiteSprite.visible = false;
      whiteSprite.filters = [whiteFilter];
      whiteSprite.width = sizeInPx;
      whiteSprite.height = sizeInPx;
      return whiteSprite;
    }
  };
}
