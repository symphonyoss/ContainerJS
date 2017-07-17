export class app {
  static ready() {
    return Promise.resolve();
  }

  static setBadgeCount(count: number) {
    // browser doesn't support badge count
  }
}
