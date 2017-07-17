export class app {
  static ready() {
    return Promise.resolve();
  }

  static setBadgeCount(count: number) {
    // Browser doesn't support badge count
  }
}
