/* globals html2canvas */
import 'html2canvas';

class ScreenSnippet {
  capture() {
    return html2canvas(document.body)
      .then((canvas) => canvas.toDataURL());
  }
}

export default ScreenSnippet;
