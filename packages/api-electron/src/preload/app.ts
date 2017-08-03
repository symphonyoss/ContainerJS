const electronApp = require('electron').remote.app;

export class app implements ssf.app {
  static ready() {
    return Promise.resolve();
  }

  static setBadgeCount(count: number) {
    electronApp.setBadgeCount(count);
  }
}
