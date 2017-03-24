if (!window.ssf) {
  window.ssf = {};
}

if (!window.ssf.app) {
  window.ssf.app = {};
}

window.ssf.app.ready = () => Promise.resolve();

window.accessibleWindows = {};

// if we have an opener, we are not the parent so we need to add it as a window
if (window.opener) {
  // The reference to the opener is not the full window object, so there is no onclose handler available
  window.accessibleWindows['parent'] = window.opener;
} else {
  window.name = 'parent';
}
