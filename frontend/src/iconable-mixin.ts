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
  createSprites(gateType: string): Promise<{
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
    async createSprites(gateType: string) {
      const texture = await this.loadTexture(gateType);

      return {
        sprite: this.createSprite(texture),
        whiteSprite: this.createWhiteSprite(texture),
      };
    }

    private async loadTexture(gateType: string): Promise<Texture> {
      try {
        const iconName = `${convertToKebabCase(gateType)}.png`;
        const iconPath = `/assets/${iconName}`;

        return await Assets.load(iconPath);
      } catch (error) {
        console.error(
          `Failed to load texture for gate type: ${gateType}`,
          error
        );
        throw new Error(`Failed to load texture for gate type: ${gateType}`);
      }
    }

    private createSprite(texture: Texture): Sprite {
      return new Sprite(texture);
    }

    private createWhiteSprite(texture: Texture): Sprite {
      const sprite = new Sprite(texture);
      const whiteFilter = new ColorMatrixFilter();

      whiteFilter.matrix = WHITE_FILTER_MATRIX;
      sprite.filters = [whiteFilter];

      return sprite;
    }
  };
}
