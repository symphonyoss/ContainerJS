const remote = require('electron').remote;

class ScreenSnippet implements ssf.ScreenSnippet {
  capture() {
    return new Promise<string>((resolve) => {
      remote.getCurrentWindow().capturePage((image: any) => {
        const dataUri = 'data:image/png;base64,' + image.toPng().toString('base64');
        resolve(dataUri);
      });
    });
  }
}

export default ScreenSnippet;
