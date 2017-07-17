import { createMainProcess } from './main-process';

export class app implements ssf.App {
  static ready() {
    return new Promise<void>((resolve) => {
      fin.desktop.main(() => createMainProcess(resolve));
    });
  }

  static setBadgeCount(count: number) {
    // Openfin doesn't support badge count
  }
}
