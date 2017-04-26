const ipc = require('electron').ipcRenderer;
import { IpcMessages } from '../common/constants';

class ScreenSnippet {
  capture() {
    return new Promise((resolve) => {
      ipc.once(IpcMessages.IPC_SSF_SCREEN_SNIPPET_CAPTURED, (event, imageDataUri) => {
        resolve(imageDataUri);
      });
      ipc.send(IpcMessages.IPC_SSF_CAPTURE_SCREEN_SNIPPET);
    });
  }
}

export default ScreenSnippet;
