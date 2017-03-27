const ipc = require('electron').ipcRenderer;

class ScreenSnippet {
  capture() {
    return new Promise((resolve) => {
      ipc.once('ssf-screen-snippet-captured', (imageDataUri) => {
        resolve(imageDataUri);
      });
      ipc.send('ssf-capture-screen-snippet');
    });
  }
}

export default ScreenSnippet;
