const ipc = require('electron').ipcRenderer;

class Window {
  constructor(url, name, features) {
    return ipc.sendSync('ssf-new-window', {
      url,
      name,
      features
    });
  }

  static getCurrentWindowId() {
    return ipc.sendSync('ssf-get-window-id');
  }
}

export default Window;
