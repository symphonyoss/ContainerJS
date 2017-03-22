if (!window.ssf) {
  window.ssf = {};
}

if (!window.ssf.app) {
  window.ssf.app = {};
}

window.ssf.app.ready = () => new Promise((resolve) => {
  fin.desktop.main(resolve);
});
