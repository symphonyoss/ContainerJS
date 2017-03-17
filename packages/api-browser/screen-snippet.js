/* globals html2canvas */

class ScreenSnippet {
  capture() {
    return html2canvas(document.body)
      .then((canvas) => canvas.toDataURL());
  }
}

if (!window.ssf) {
  window.ssf = {};
}

window.ssf.ScreenSnippet = ScreenSnippet;
