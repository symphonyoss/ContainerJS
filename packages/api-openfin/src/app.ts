import { createMainProcess } from './main-process';

let initialisePromise = null;
export class app implements ssf.app {
  static ready() {
    if (!initialisePromise) {
      initialisePromise = new Promise<void>((resolve) => {
        fin.desktop.main(() => createMainProcess(resolve));
      });
    }
    return initialisePromise;
  }

  static setBadgeCount(count: number) {
    // Openfin doesn't support badge count
  }
}
