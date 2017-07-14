declare namespace ssf {
  export abstract class Screen {
    static getDisplays(): Promise<Array<Display>>;
  }

  /**
   * Information about the users display. Note that the Browser API does not support multiple
   * displays, so it assumes the display the browser is running in is the only display.
   */
  export interface Display {
    /**
     * Unique Id of the display.
     */
    id: string;

    /**
     * Current rotation of the display, can be 0, 90, 180, 270.
     */
    rotation: number;

    /**
     * How much the display has been scaled.
     */
    scaleFactor: number;

    /**
     * If the display is the primary display
     */
    primary: boolean;

    /**
     * Bounds of the display.
     */
    bounds: ssf.Rectangle;
  }
}
