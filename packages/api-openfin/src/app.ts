import createMainProcess from './main-process';

class app implements ssf.App {
  static ready() {
    return new Promise<void>((resolve) => {
      fin.desktop.main(() => createMainProcess(resolve));
    });
  }
}

export default app;
