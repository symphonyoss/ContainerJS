const ipc = require('electron').ipcRenderer;

class Window {
  constructor(url, name, features) {
    this.id = ipc.sendSync('ssf-new-window', {
      url,
      name,
      features
    }).id;
  }

  close() {
    ipc.send('ssf-close-window', this.id);
  }

  show() {
    ipc.send('ssf-show-window', this.id);
  }

  hide() {
    ipc.send('ssf-hide-window', this.id);
  }

  static getCurrentWindowId() {
    return ipc.sendSync('ssf-get-window-id');
  }
}

export default Window;
