const assert = require('assert');
const {
  beforeEach,
  afterEach,
  describe,
  it
} = require('mocha');
const testContainer = process.env.MOCHA_CONTAINER;
const setup = require(`./${testContainer}-test-setup`);
const {
  executeAsyncJavascript,
  selectWindow,
  openNewWindow
} = require('./test-helpers');

let app;

describe('Window API', function(done) {
  const timeout = 60000;
  this.timeout(timeout);

  beforeEach(() => {
    app = setup(timeout);
    return app.start();
  });

  afterEach(function() {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  const callWindowMethod = (method) => {
    /* eslint-disable no-undef */
    const script = (method, callback) => {
      var currentWin = ssf.Window.getCurrentWindow();
      currentWin[method]().then((data) => {
        callback(data);
      });
    };
    /* eslint-enable no-undef */
    return executeAsyncJavascript(app.client, script, method);
  };

  it('Check ssf.Window is available globally', function() {
    /* eslint-disable no-undef */
    const script = (callback) => {
      if (ssf.Window !== undefined) {
        callback();
      }
    };
    /* eslint-enable no-undef */
    return executeAsyncJavascript(app.client, script);
  });

  describe('New Window', function() {
    it('Check window constructor opens a new window', function() {
      return openNewWindow(app.client, {url: 'about:blank', name: 'test', show: true, child: true}).then((result) => {
        return app.client.getWindowCount().then((count) => {
          assert.equal(count, 2);
        });
      });
    });

    it('Check new window has correct x position', function() {
      const windowTitle = 'windownamex';
      const xValue = 100;
      const windowOptions = {
        url: 'http://localhost:5000/index.html',
        name: windowTitle,
        show: true,
        x: xValue,
        y: 0,
        child: true
      };

      return app.client.isVisible('.visible-check')
        .then(() => openNewWindow(app.client, windowOptions))
        .then(() => selectWindow(app.client, 1))
        .then(() => app.client.waitForVisible('.visible-check'))
        .then(() => callWindowMethod('getBounds'))
        .then((result) => assert.equal(result.value.x, xValue));
    });

    it('Check new window has correct y position', function() {
      const windowTitle = 'windownamey';
      const yValue = 100;
      const windowOptions = {
        url: 'http://localhost:5000/index.html',
        name: windowTitle,
        show: true,
        x: 0,
        y: yValue,
        child: true
      };

      return app.client.isVisible('.visible-check')
        .then(() => openNewWindow(app.client, windowOptions))
        .then(() => selectWindow(app.client, 1))
        .then(() => app.client.waitForVisible('.visible-check'))
        .then(() => callWindowMethod('getBounds'))
        .then((result) => assert.equal(result.value.y, yValue));
    });
  });
});
