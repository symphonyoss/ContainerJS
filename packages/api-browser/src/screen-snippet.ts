import 'html2canvas';
declare let html2canvas: any;

export class ScreenSnippet implements ssf.ScreenSnippet {
  capture() {
    return html2canvas(document.body)
      .then((canvas) => canvas.toDataURL());
  }
}
