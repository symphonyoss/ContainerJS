declare namespace ssf {
  /**
   * Position and size of an object on screen
   */
  export interface Rectangle {
    /**
     * Horizontal position in pixels
     */
    x: number;
    /**
     * Vertical position in pixels
     */
    y: number;
    /**
     * Width in pixels
     */
    width: number;
    /**
     * Height in pixels
     */
    height: number;
  }
}
