import { Assets, ColorMatrixFilter, Container, Sprite } from "pixi.js";
import { Constructor } from "./constructor";
import { convertToKebabCase } from "./util";

export declare class Iconable {
  sprite: Sprite;
  whiteSprite: Sprite;
  loadTextures(gateType: string, sizeInPx: number): Promise<void>;
}

export function IconableMixin<TBase extends Constructor<Container>>(
  Base: TBase
): Constructor<Iconable> & TBase {
  return class IconableMixinClass extends Base {
    sprite!: Sprite;
    whiteSprite!: Sprite;

    get gateType(): string {
      return this.constructor.name;
    }

    async loadTextures(gateType: string, sizeInPx: number) {
      const iconName = `${convertToKebabCase(gateType)}.png`;
      const iconPath = `./assets/${iconName}`;
      const texture = await Assets.load(iconPath);

      this.sprite = new Sprite(texture);
      this.whiteSprite = new Sprite(texture);

      this.addChild(this.sprite);
      this.sprite.width = sizeInPx;
      this.sprite.height = sizeInPx;

      const whiteFilter = new ColorMatrixFilter();
      whiteFilter.matrix = [
        0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0,
      ];
      this.addChild(this.whiteSprite);
      this.whiteSprite.visible = false;
      this.whiteSprite.filters = [whiteFilter];
      this.whiteSprite.width = sizeInPx;
      this.whiteSprite.height = sizeInPx;
    }
  };
}
