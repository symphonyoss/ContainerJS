declare namespace ssf {
  /**
   * Exposes methods that relate to the Screen and Display Monitors.
   *
   * <pre>
   * ssf.Screen.getDisplays().then(displays => {
   *   console.log(`${displays.length} displays`);
   * });
   * </pre>
   */
  export abstract class Screen {
    /**
     * Get all the monitor displays that are available.
     *
     * Note that the Browser API does not support multiple displays, so it
     * assumes the display the browser is running in is the only display.
     * @returns A promise which resolves to an array of available displays.
     */
    static getDisplays(): Promise<Array<Display>>;
  }

  /**
   * Information about the user's display. Note that the Browser API does not support multiple
   * displays, so it assumes the display the browser is running in is the only display.
   *
   * The <a href="#Screen">Screen</a> class can be used to retrieve display information.
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
