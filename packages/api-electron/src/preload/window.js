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
    this.sendWindowAction('ssf-close-window');
  }

  show() {
    this.sendWindowAction('ssf-show-window');
  }

  hide() {
    this.sendWindowAction('ssf-hide-window');
  }

  focus() {
    this.sendWindowAction('ssf-focus-window');
  }

  blur() {
    this.sendWindowAction('ssf-blur-window');
  }

  sendWindowAction(action) {
    ipc.send(action, this.innerWindow.id);
  }

  static getCurrentWindowId() {
    return ipc.sendSync('ssf-get-window-id');
  }

  static getCurrentWindow() {
    return new Window();
  }
}

export default Window;
