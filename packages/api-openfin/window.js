if (!window.ssf) {
  window.ssf = {};
}

window.ssf.Window = (url, name, features) => window.open(url, name, features);
