let currentWindow = null;

class Window {
  constructor(...args) {
    if (args.length === 0) {
      this.innerWindow = fin.desktop.Window.getCurrent();
    } else {
      const [url, name, features] = args;

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
      this.innerWindow = newWindow;
    }
  }

  close() {
    this.innerWindow.close();
  }

  hide() {
    this.innerWindow.hide();
  }

  show() {
    this.innerWindow.show();
  }

  focus() {
    this.innerWindow.focus();
  }

  blur() {
    this.innerWindow.blur();
  }

  static getCurrentWindowId() {
    const currentWin = fin.desktop.Window.getCurrent();
    return `${currentWin.uuid}:${currentWin.name}`;
  }

  static getCurrentWindow() {
    if (currentWindow) {
      return currentWindow;
    }

    currentWindow = new Window();
    return currentWindow;
  }
}

export default Window;
