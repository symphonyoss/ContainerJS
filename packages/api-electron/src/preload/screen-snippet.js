const remote = require('electron').remote;

class ScreenSnippet {
  capture() {
    return new Promise((resolve) => {
      remote.getCurrentWindow().capturePage((image) => {
        const dataUri = 'data:image/png;base64,' + image.toPng().toString('base64');
        resolve(dataUri);
      });
    });
  }
}

export default ScreenSnippet;
