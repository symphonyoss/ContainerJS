if (!window.ssf) {
  window.ssf = {};
}

class Window {
  constructor(url, name, features) {
    let newWindow;
    const handleError = (error) => console.error('Error creating window: ' + error);

    if (features && features.child) {
      newWindow = new fin.desktop.Window({
        name,
        url
      }, () => newWindow.show(), handleError);
    } else {
      // UUID must be the same as name
      const uuid = name;
      const mainWindowOptions = {
        autoShow: true
      };

      const app = new fin.desktop.Application({
        name,
        url,
        uuid,
        mainWindowOptions
      }, () => app.run(), handleError);

      // Need to return the window object, not the application
      newWindow = app.getWindow();
    }

    return newWindow;
  }

  static getCurrentWindowId() {
    const currentWin = fin.desktop.Window.getCurrent();
    return `${currentWin.uuid}:${currentWin.name}`;
  }
}

window.ssf.Window = Window;
