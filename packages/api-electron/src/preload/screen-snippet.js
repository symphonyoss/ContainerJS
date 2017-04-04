const ipc = require('electron').ipcRenderer;
import constants from '../common/constants';

class ScreenSnippet {
  capture() {
    return new Promise((resolve) => {
      ipc.once(constants.ipc.SSF_SCREEN_SNIPPET_CAPTURED, (imageDataUri) => {
        resolve(imageDataUri);
      });
      ipc.send(constants.ipc.SSF_CAPTURE_SCREEN_SNIPPET);
    });
  }
}

export default ScreenSnippet;
