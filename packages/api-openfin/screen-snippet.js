class ScreenSnippet {
  capture() {
    return new Promise((resolve, reject) => {
      fin.desktop.Window.getCurrent()
        .getSnapshot((snapshot) => { resolve('data:image/png;base64,' + snapshot); }, reject);
    });
  }
}

if (!window.ssf) {
  window.ssf = {};
}

window.ssf.ScreenSnippet = ScreenSnippet;
