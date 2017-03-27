const ipc = require('electron').ipcRenderer;

class Window {
  constructor(...args) {
    if (args.length === 0) {
      this.innerWindow = {
        id: window.ssf.Window.getCurrentWindowId()
      };
    } else {
      const [url, name, features] = args;

      this.innerWindow = ipc.sendSync('ssf-new-window', {
        url,
        name,
        features
      });
    }
  }

  close() {
    ipc.send('ssf-close-window', this.innerWindow.id);
  }

  show() {
    ipc.send('ssf-show-window', this.innerWindow.id);
  }

  hide() {
    ipc.send('ssf-hide-window', this.innerWindow.id);
  }

  static getCurrentWindowId() {
    return ipc.sendSync('ssf-get-window-id');
  }

  static getCurrentWindow() {
    return new Window();
  }
}

export default Window;
