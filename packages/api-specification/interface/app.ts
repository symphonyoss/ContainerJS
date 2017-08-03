declare namespace ssf {
  class app {
    /**
     * A promise that resolves when the API has finished bootstrapping.
     */
    static ready(): Promise<any>;

    /**
     * Sets the counter badge for current app. Setting the count to 0 will hide the badge. This
     * is currently only supported on Mac and Linux.
     * @param count - the integer count for the app.
     */
    static setBadgeCount(count: number);
  }
}
