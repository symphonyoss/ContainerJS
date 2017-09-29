declare namespace ssf {
  /**
   * Manage the ContainerJS application
   */
  class app {
    /**
     * Wait until the API has bootstrapped before it is ready to use
     *
     * <i>Note that some APIs may fail if the application tries to call
     * them before the API layer has finished bootstrapping.</i>
     *
     * <pre>
     * ssf.app.ready().then(() => {
     *  console.log('Application is running');
     * });
     * </pre>
     *
     * @returns A promise that resolves when the API has finished bootstrapping.
     */
    static ready(): Promise<any>;

    /**
     * Sets the counter badge for current app. Setting the count to 0 will hide the badge. This
     * is currently only supported in Electron on Mac and Linux.
     * @param count - the integer count for the app.
     */
    static setBadgeCount(count: number);
  }
}
