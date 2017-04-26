const containerSetup = require('../test-container-setup.js');
const {
  beforeEach,
  afterEach,
  describe,
  it
} = require('mocha');
const liveServer = require('live-server');
const assert = require('assert');

const params = {
  port: 5000,
  host: '127.0.0.1',
  root: 'src',
  open: false,
  ignore: '*'
};

let app;

describe('Window API', function(done) {
  const timeout = 60000;
  this.timeout(timeout);

  beforeEach(() => {
    liveServer.start(params);
    app = containerSetup(timeout);

    return app.start();
  });

  afterEach(function() {
    liveServer.shutdown();
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  function executeAsyncJavascript(client, script) {
    return client.executeAsync(script);
  };

  it('Check ssf.Window is available globally', function() {
    const script = `
      var callback = arguments[arguments.length - 1];
      if (ssf.Window !== undefined) {
        callback();
      }
    `;
    return executeAsyncJavascript(app.client, script);
  });

  it('Check window constructor opens a new window', function() {
    const script = `
      var callback = arguments[arguments.length - 1];
      new ssf.Window({url: 'about:blank', name: 'test', show: true, child: true});
      setTimeout(() => callback(), 500);
    `;
    return executeAsyncJavascript(app.client, script).then((result) => {
      return app.client.getWindowCount().then((count) => {
        assert.equal(count, 2);
      });
    });
  });

  it('Check new window has correct x position', function() {
    const windowTitle = 'windowname';
    const xValue = 10;
    const script = `
      var callback = arguments[arguments.length - 1];
      new ssf.Window({url: 'http://localhost:5000/index.html', name: '${windowTitle}', show: true, x: ${xValue}, y: 0, child: true});
      callback();
    `;
    return executeAsyncJavascript(app.client, script)
    .then(() =>
      app.client.windowHandles()
        .then((handles) => {
          const getBoundsScript = `
            var callback = arguments[arguments.length - 1];
            var currentWin = ssf.Window.getCurrentWindow();
            currentWin.getBounds().then((bounds) => {
              callback(bounds.x);
            });
          `;

          app.client.window(handles.value[1]);

          return app.client.waitForVisible('.container')
            .then(() =>
              executeAsyncJavascript(app.client, getBoundsScript)
                .then((result) => {
                  assert.equal(result.value, xValue);
                }));
        })
    );
  });
});
