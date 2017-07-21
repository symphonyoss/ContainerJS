/* eslint-disable no-undef, no-new */
const executeAsyncJavascript = (client, script, ...args) => {
  // script is passed a callback as its final argument
  return client.executeAsync(script, ...args);
};

const selectWindow = (client, handle) => {
  return client.windowHandles()
      .then((handles) => client.window(handles.value[handle]));
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
  return client.getWindowCount()
    .then(result => {
      if (process.env.MOCHA_CONTAINER === 'openfin') {
        // Hidden mainWindow is still there
        return result - 1;
      } else {
        return result;
      }
    });
};

const chainPromises = (promises) => promises.reduce((acc, cur) => acc.then(cur), Promise.resolve());

module.exports = {
  executeAsyncJavascript,
  selectWindow,
  openNewWindow,
  countWindows,
  chainPromises
};
