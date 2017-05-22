class ScreenSnippet implements ssf.ScreenSnippet {
  capture() {
    return new Promise((resolve, reject) => {
      fin.desktop.Window.getCurrent()
        .getSnapshot((snapshot) => { resolve('data:image/png;base64,' + snapshot); }, reject);
    });
  }
}

export default ScreenSnippet;
