// Need to import using this syntax as require doesn't work for local files + rollup
import * as browserApi from './build/es/index.js';

let api;
if (!window.ssf && !window.fin) {
  api = browserApi;
} else {
  // api always overrides ssf because of the module name
  // so if there is already an implementation of ssf, we need to keep it
  api = window.ssf;
}

export default api;
