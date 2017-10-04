/* eslint-disable no-undef, no-new */
const executeAsyncJavascript = (client, script, ...args) => {
  // script is passed a callback as its final argument
  return client.executeAsync(script, ...args);
};

// In OpenFin, an extra hidden window gets created that interferes
// with tests that counts windows or selects windows by index. This
// initialisation gets the added window handles, so they can be
// excluded later
let addedHandles = [];
const initialiseWindows = (client) => {
  // Script to wait for app.ready()
  const script = (callback) => {
    if (window.ssf) {
      ssf.app.ready().then(() => {
        callback();
      });
    } else {
      callback();
    }
  };

  // Get a list of any extra window handles that get create during initialisation
  return executeAsyncJavascript(client, script)
      .then(() => client.windowHandles())
      .then(handles => {
        // The first one is the real main window, and we want
        // to exclude the rest
        addedHandles = handles.value.splice(1);
      });
};

// Get a list of window handles excluding windows added during initialisation
const getWindowHandles = (client) => {
  return client.windowHandles()
      .then(result => {
        return result.value.filter(h => addedHandles.indexOf(h) === -1);
      });
};

const selectWindow = (client, index) => {
  return getWindowHandles(client)
      .then(handles => client.window(handles[index]));
};

const openNewWindow = (client, options) => {
  const script = (options, callback) => {
    ssf.app.ready().then(() => {
      new ssf.Window(options, (win) => {
        window.newWin = win;
        callback(win.getId());
      });
    });
  };
  return executeAsyncJavascript(client, script, options);
};
/* eslint-enable no-undef, no-new */

const countWindows = (client) => {
  return getWindowHandles(client)
      .then(winHandles => winHandles.length);
};

const chainPromises = (promises) => promises.reduce((acc, cur) => acc.then(cur), Promise.resolve());

module.exports = {
  executeAsyncJavascript,
  initialiseWindows,
  selectWindow,
  openNewWindow,
  countWindows,
  chainPromises
};
