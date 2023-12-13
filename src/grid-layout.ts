import { Container } from "@pixi/display";

export type GridLayoutOptions = {
  cols?: number;
  elementsMargin?: number;
  children?: Container[];
  vertPadding?: number;
  horPadding?: number;
  items?: Container[];
};

export class GridLayout extends Container {
  private options?: GridLayoutOptions;

  /** Container, that holds all inner elements. */
  view: Container;

  private _cols: number = 1;

  /** Returns all arranged elements. */
  override readonly children: Container[] = [];

  constructor(options?: { cols?: number } & GridLayoutOptions) {
    super();

    if (options) {
      this.init(options);
    }

    options?.items?.forEach((item) => this.addChild(item));

    this.on("added", () => this.arrangeChildren());
    this.on("childAdded", () => this.arrangeChildren());
  }

  /**
   * Initiates GridLayout component.
   * @param options
   */
  init(options?: { cols?: number } & GridLayoutOptions) {
    this.options = options;

    if (options?.cols) {
      this.cols = options.cols;
    }

    this.arrangeChildren();

    if (options?.children) {
      options.children.forEach((child) => this.addChild(child));
    }
  }

  set cols(newValue: number) {
    this._cols = newValue;
    this.arrangeChildren();
  }

  get cols(): number {
    return this._cols;
  }
  /**
   * Set element margin.
   * @param margin - Margin between elements.
   */
  set elementsMargin(margin: number) {
    this.options.elementsMargin = margin;
    this.arrangeChildren();
  }

  /**
   * Get element margin.
   * @returns Margin between elements.
   */
  get elementsMargin(): number {
    return this.options.elementsMargin;
  }

  /**
   * Set vertical padding.
   * @param padding - Vertical padding between GridLayout border and its elements.
   */
  set vertPadding(padding: number) {
    this.options.vertPadding = padding;
    this.arrangeChildren();
  }

  /**
   * Get vertical padding.
   * @returns Vertical padding between GridLayout border and its elements.
   */
  get vertPadding(): number {
    return this.options.vertPadding;
  }

  /**
   * Set horizontal padding.
   * @param padding - Horizontal padding between GridLayout border and its elements.
   */
  set horPadding(padding: number) {
    this.options.horPadding = padding;
    this.arrangeChildren();
  }

  /**
   * Get horizontal padding.
   * @returns Horizontal padding between GridLayout border and its elements.
   */
  get horPadding(): number {
    return this.options.horPadding;
  }

  /**
   * Arrange all elements basing in their sizes and component options.
   * Can be arranged vertically, horizontally or bidirectional.
   */
  private arrangeChildren() {
    let x = this.options?.horPadding ?? 0;
    let y = this.options?.vertPadding ?? 0;

    const elementsMargin = this.options?.elementsMargin ?? 0;

    this.children.forEach((each, index) => {
      each.x = x;
      each.y = y;

      if (index % this.cols === 0 && index > 0) {
        y += elementsMargin + each.height;
        x = this.options?.horPadding ?? 0;

        each.x = x;
        each.y = y;
      }

      x += elementsMargin + each.width;
    });
  }
}
