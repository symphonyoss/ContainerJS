const ipc = require('electron').ipcRenderer;
import ipcConstants from '../common/ipcConstants';

class ScreenSnippet {
  capture() {
    return new Promise((resolve) => {
      ipc.once(ipcConstants.IPC_SSF_SCREEN_SNIPPET_CAPTURED, (imageDataUri) => {
        resolve(imageDataUri);
      });
      ipc.send(ipcConstants.IPC_SSF_CAPTURE_SCREEN_SNIPPET);
    });
  }
}

export default ScreenSnippet;
