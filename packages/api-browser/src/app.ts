import { initialise as initialiseWindows } from './accessible-windows';

let initialised = false;
export class app implements ssf.app {
  static ready() {
    if (!initialised) {
      initialised = true;
      initialiseWindows();
    }
    return Promise.resolve();
  }

  static setBadgeCount(count: number) {
    // Browser doesn't support badge count
  }
}
