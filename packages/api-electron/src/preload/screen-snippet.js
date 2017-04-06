const ipc = require('electron').ipcRenderer;
import {
  IPC_SSF_CAPTURE_SCREEN_SNIPPET,
  IPC_SSF_SCREEN_SNIPPET_CAPTURED
} from '../common/constants';

class ScreenSnippet {
  capture() {
    return new Promise((resolve) => {
      ipc.once(IPC_SSF_SCREEN_SNIPPET_CAPTURED, (imageDataUri) => {
        resolve(imageDataUri);
      });
      ipc.send(IPC_SSF_CAPTURE_SCREEN_SNIPPET);
    });
  }
}

export default ScreenSnippet;
