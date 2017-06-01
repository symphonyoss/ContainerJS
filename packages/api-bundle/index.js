let api;

if (!window.ssf) {
  if (window.fin) {
    api = require('containerjs-api-openfin');
  } else {
    api = require('containerjs-api-browser');
  }
} else {
  // api always overrides ssf because of the module name
  // so if there is already an implementation of ssf, we need to keep it
  api = window.ssf;
}

module.exports = api;
