const assert = require('assert');
const testContainer = process.env.MOCHA_CONTAINER;
const setup = require(`./${testContainer}-test-setup`);
const {
  executeAsyncJavascript,
  selectWindow,
  openNewWindow,
  chainPromises
} = require('./test-helpers');

let app;

const getWindowOptions = (options) => Object.assign({
  url: 'http://localhost:5000/index.html',
  show: true,
  child: true
}, options);

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

  it('Should have ssf.Window available globally', function() {
    /* eslint-disable no-undef */
    const script = (callback) => {
      if (ssf.Window !== undefined) {
        callback();
      }
    };
    /* eslint-enable no-undef */
    return executeAsyncJavascript(app.client, script);
  });

  describe('Methods', function() {
    it('Should close the window', function() {
      const windowTitle = 'windownameclose';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        () => app.client.isVisible('.visible-check'),
        () => openNewWindow(app.client, windowOptions),
        () => selectWindow(app.client, 1),
        () => app.client.waitForVisible('.visible-check'),
        () => callWindowMethod('close'),
        () => app.client.getWindowCount(),
        (result) => assert.equal(result, 1)
      ];

      return chainPromises(steps);
    });

    it('Should get the bounds of the window', function() {
      const windowTitle = 'windownamegetbounds';
      const x = 50;
      const y = 50;
      const width = 800;
      const height = 600;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        x,
        y,
        width,
        height
      });

      const steps = [
        () => app.client.isVisible('.visible-check'),
        () => openNewWindow(app.client, windowOptions),
        () => selectWindow(app.client, 1),
        () => app.client.waitForVisible('.visible-check'),
        () => callWindowMethod('getBounds'),
        (result) => {
          assert.equal(result.value.height, height);
          assert.equal(result.value.width, width);
          assert.equal(result.value.x, x);
          assert.equal(result.value.y, y);
        }
      ];

      return chainPromises(steps);
    });

    it('Should return a boolean stating if the window is alwaysOnTop', function() {
      const windowTitle = 'windownameminimized';
      const alwaysOnTop = true;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        alwaysOnTop
      });

      const steps = [
        () => app.client.isVisible('.visible-check'),
        () => openNewWindow(app.client, windowOptions),
        () => selectWindow(app.client, 1),
        () => app.client.waitForVisible('.visible-check'),
        () => callWindowMethod('isAlwaysOnTop'),
        (result) => assert.equal(result.value, alwaysOnTop)
      ];

      return chainPromises(steps);
    });

    it('Should return a boolean stating if the window is maximizable', function() {
      const windowTitle = 'windownameminimized';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        () => app.client.isVisible('.visible-check'),
        () => openNewWindow(app.client, windowOptions),
        () => selectWindow(app.client, 1),
        () => app.client.waitForVisible('.visible-check'),
        () => callWindowMethod('isMaximizable'),
        (result) => assert.equal(result.value, true)
      ];

      return chainPromises(steps);
    });

    it('Should return a boolean stating if the window is minimizable', function() {
      const windowTitle = 'windownameminimized';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        () => app.client.isVisible('.visible-check'),
        () => openNewWindow(app.client, windowOptions),
        () => selectWindow(app.client, 1),
        () => app.client.waitForVisible('.visible-check'),
        () => callWindowMethod('isMinimizable'),
        (result) => assert.equal(result.value, true)
      ];

      return chainPromises(steps);
    });

    it('Should return a boolean stating if the window is resizable', function() {
      const windowTitle = 'windownameminimized';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        () => app.client.isVisible('.visible-check'),
        () => openNewWindow(app.client, windowOptions),
        () => selectWindow(app.client, 1),
        () => app.client.waitForVisible('.visible-check'),
        () => callWindowMethod('isResizable'),
        (result) => assert.equal(result.value, true)
      ];

      return chainPromises(steps);
    });

    it('Should return a boolean stating if the window is minimized', function() {
      const windowTitle = 'windownameminimized';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        () => app.client.isVisible('.visible-check'),
        () => openNewWindow(app.client, windowOptions),
        () => selectWindow(app.client, 1),
        () => app.client.waitForVisible('.visible-check'),
        () => callWindowMethod('isMinimized'),
        (result) => assert.equal(result.value, false)
      ];

      return chainPromises(steps);
    });

    it('Should minimize the window', function() {
      const windowTitle = 'windownameminimize';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        () => app.client.isVisible('.visible-check'),
        () => openNewWindow(app.client, windowOptions),
        () => selectWindow(app.client, 1),
        () => app.client.waitForVisible('.visible-check'),
        () => callWindowMethod('minimize'),
        () => callWindowMethod('isMinimized'),
        (result) => assert.equal(result.value, true)
      ];

      return chainPromises(steps);
    });

    it('Should return a boolean stating if the window is maximized', function() {
      const windowTitle = 'windownamemaximized';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        () => app.client.isVisible('.visible-check'),
        () => openNewWindow(app.client, windowOptions),
        () => selectWindow(app.client, 1),
        () => app.client.waitForVisible('.visible-check'),
        () => callWindowMethod('isMaximized'),
        (result) => assert.equal(result.value, false)
      ];

      return chainPromises(steps);
    });

    it('Should maximize the window', function() {
      const windowTitle = 'windownamemaximize';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        () => app.client.isVisible('.visible-check'),
        () => openNewWindow(app.client, windowOptions),
        () => selectWindow(app.client, 1),
        () => app.client.waitForVisible('.visible-check'),
        () => callWindowMethod('maximize'),
        () => callWindowMethod('isMaximized'),
        (result) => assert.equal(result.value, true)
      ];

      return chainPromises(steps);
    });

    it('Should restore the window from maximized', function() {
      const windowTitle = 'windownamerestoremax';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        () => app.client.isVisible('.visible-check'),
        () => openNewWindow(app.client, windowOptions),
        () => selectWindow(app.client, 1),
        () => app.client.waitForVisible('.visible-check'),
        () => callWindowMethod('maximize'),
        () => callWindowMethod('restore'),
        () => callWindowMethod('isMaximized'),
        (result) => assert.equal(result.value, false)
      ];

      return chainPromises(steps);
    });

    it('Should restore the window from minimized', function() {
      const windowTitle = 'windownamerestoremin';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        () => app.client.isVisible('.visible-check'),
        () => openNewWindow(app.client, windowOptions),
        () => selectWindow(app.client, 1),
        () => app.client.waitForVisible('.visible-check'),
        () => callWindowMethod('minimize'),
        () => callWindowMethod('restore'),
        () => callWindowMethod('isMinimized'),
        (result) => assert.equal(result.value, false)
      ];

      return chainPromises(steps);
    });

    it('Should unmaximize the window from maximized', function() {
      const windowTitle = 'windownameunmaximize';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        () => app.client.isVisible('.visible-check'),
        () => openNewWindow(app.client, windowOptions),
        () => selectWindow(app.client, 1),
        () => app.client.waitForVisible('.visible-check'),
        () => callWindowMethod('maximize'),
        () => callWindowMethod('unmaximize'),
        () => callWindowMethod('isMaximized'),
        (result) => assert.equal(result.value, false)
      ];

      return chainPromises(steps);
    });
  });

  describe('New Window', function() {
    it('Should open a new window', function() {
      return openNewWindow(app.client, {url: 'about:blank', name: 'test', show: true, child: true}).then((result) => {
        return app.client.getWindowCount().then((count) => {
          assert.equal(count, 2);
        });
      });
    });

    it('Should be created with the correct x position', function() {
      const windowTitle = 'windownamex';
      const xValue = 100;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        x: xValue
      });

      const steps = [
        () => app.client.isVisible('.visible-check'),
        () => openNewWindow(app.client, windowOptions),
        () => selectWindow(app.client, 1),
        () => app.client.waitForVisible('.visible-check'),
        () => callWindowMethod('getPosition'),
        (result) => assert.equal(result.value[0], xValue)
      ];

      return chainPromises(steps);
    });

    it('Should be created with the correct y position', function() {
      const windowTitle = 'windownamey';
      const yValue = 100;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        y: yValue
      });

      const steps = [
        () => app.client.isVisible('.visible-check'),
        () => openNewWindow(app.client, windowOptions),
        () => selectWindow(app.client, 1),
        () => app.client.waitForVisible('.visible-check'),
        () => callWindowMethod('getPosition'),
        (result) => assert.equal(result.value[1], yValue)
      ];

      return chainPromises(steps);
    });
  });
});
