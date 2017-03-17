if (!window.ssf) {
  window.ssf = {};
}

class Window {
  constructor(...args) {
    window.open(...args);
  }
}

window.ssf.Window = Window;
