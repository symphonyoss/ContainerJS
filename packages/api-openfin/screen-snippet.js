/* globals html2canvas */

class ScreenSnippet {
  capture() {
    return html2canvas(document.body)
      .then((canvas) => createImageBitmap(canvas));
  }
}

if (!window.ssf) {
  window.ssf = {};
}

window.ssf.ScreenSnippet = ScreenSnippet;
