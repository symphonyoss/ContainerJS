const {
  remote
} = require('electron');
const electronApp = remote.app;

export class app implements ssf.App {
  static ready() {
    return Promise.resolve();
  }

  static setBadgeCount(count: number) {
    electronApp.setBadgeCount(count);
  }
}
