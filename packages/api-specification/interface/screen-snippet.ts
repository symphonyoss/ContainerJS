declare namespace ssf {
  class ScreenSnippet {
    /**
     * Captures the current visible screen. Returns the image as a base64 encoded png string.
     */
    capture(): Promise<string>;
  }
}
