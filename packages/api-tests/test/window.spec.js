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

const setupWindowSteps = (windowOptions) => [
  () => app.client.isVisible('.visible-check'),
  () => openNewWindow(app.client, windowOptions),
  () => selectWindow(app.client, 1),
  () => app.client.waitForVisible('.visible-check')
];

const retrieveWebUrl = () => {
  /* eslint-disable no-undef */
  const script = (callback) => {
    callback('test');
  };
  /* eslint-enable no-undef */
  return executeAsyncJavascript(app.client, script);
};

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

  const callAsyncWindowMethod = (method, ...args) => {
    /* eslint-disable no-undef */
    const script = (method, args, callback) => {
      var currentWin = ssf.Window.getCurrentWindow();
      currentWin[method](...args).then((data) => {
        callback(data);
      });
    };
    /* eslint-enable no-undef */
    return executeAsyncJavascript(app.client, script, method, args);
  };

  const callWindowMethod = (method, ...args) => {
    /* eslint-disable no-undef */
    const script = (method, args, callback) => {
      var currentWin = ssf.Window.getCurrentWindow();
      callback(currentWin[method](...args));
    };
    /* eslint-enable no-undef */
    return executeAsyncJavascript(app.client, script, method, args);
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
    it.skip('Should blur the window #ssf.Window.blur', function() {

    });

    it('Should close the window #ssf.Window.close', function() {
      const windowTitle = 'windownameclose';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('close'),
        () => app.client.getWindowCount(),
        (result) => assert.equal(result, 1)
      ];

      return chainPromises(steps);
    });

    it.skip('Should flash the window frame #ssf.Window.flashFrame', function() {

    });

    it.skip('Should focus on the window #ssf.Window.focus', function() {

    });

    it('Should get the bounds of the window #ssf.Window.getBounds', function() {
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
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('getBounds'),
        (result) => {
          assert.equal(result.value.height, height);
          assert.equal(result.value.width, width);
          assert.equal(result.value.x, x);
          assert.equal(result.value.y, y);
        }
      ];

      return chainPromises(steps);
    });

    it.skip('Should get the child windows #ssf.Window.getChildWindows', function() {
      const windowTitle = 'windownameclose';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => selectWindow(app.client, 0),
        () => callWindowMethod('getChildWindows'),
        (result) => assert.equal(result.value.length, 1)
      ];

      return chainPromises(steps);
    });

    it('Should not get child windows if there isn\'t any #ssf.Window.getChildWindows', function() {
      const windowTitle = 'windownameclose';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => selectWindow(app.client, 1),
        () => callWindowMethod('getChildWindows'),
        (result) => assert.equal(result.value.length, 0)
      ];

      return chainPromises(steps);
    });

    it('Should return the maximum width #ssf.Window.getMaximumSize', function() {
      const windowTitle = 'windownamemaxwidth';
      const maxWidth = 500;
      const maxHeight = 600;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        maxWidth,
        maxHeight
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('getMaximumSize'),
        (result) => assert.equal(result.value[0], maxWidth)
      ];

      return chainPromises(steps);
    });

    it.skip('Should return the maximum height #ssf.Window.getMaximumSize', function() {
      const windowTitle = 'windownamemaxheight';
      const maxWidth = 500;
      const maxHeight = 600;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        maxWidth,
        maxHeight
      });

      const frameSize = process.platform === 'win32' ? 20 : 25;

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('getMaximumSize'),
        (result) => assert.equal(result.value[1], maxHeight + frameSize)
      ];

      return chainPromises(steps);
    });

    it('Should return the minimum width #ssf.Window.getMinimumSize', function() {
      const windowTitle = 'windownameminwidth';
      const minWidth = 500;
      const minHeight = 600;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        minWidth,
        minHeight
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('getMinimumSize'),
        (result) => assert.equal(result.value[0], minWidth)
      ];

      return chainPromises(steps);
    });

    it.skip('Should return the minimum height #ssf.Window.getMinimumSize', function() {
      const windowTitle = 'windownameminheight';
      const minWidth = 500;
      const minHeight = 600;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        minWidth,
        minHeight
      });

      const frameSize = process.platform === 'win32' ? 20 : 25;

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('getMinimumSize'),
        (result) => assert.equal(result.value[1], minHeight + frameSize)
      ];

      return chainPromises(steps);
    });

    it.skip('Should return the parent window #ssf.Window.getParentWindow', function() {
      const windowTitle = 'windownamegetparent';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('getParentWindow'),
        (result) => assert.equal(true, true)
      ];

      return chainPromises(steps);
    });

    it('Should return null if there is no parent window #ssf.Window.getParentWindow', function() {
      const windowTitle = 'windownamegetparentnull';
      const windowOptions = getWindowOptions({
        name: windowTitle,
        child: false
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('getParentWindow'),
        (result) => assert.equal(result.value, null),
        () => callAsyncWindowMethod('close')
      ];

      return chainPromises(steps);
    });

    it('Should return the x position #ssf.Window.getPosition', function() {
      const windowTitle = 'windownamegetposX';
      const x = 300;
      const y = 400;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        x,
        y
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('getPosition'),
        (result) => assert.equal(result.value[0], x)
      ];

      return chainPromises(steps);
    });

    it('Should return the y position #ssf.Window.getPosition', function() {
      const windowTitle = 'windownamegetposy';
      const x = 300;
      const y = 400;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        x,
        y
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('getPosition'),
        (result) => assert.equal(result.value[1], y)
      ];

      return chainPromises(steps);
    });

    it('Should return the width #ssf.Window.getSize', function() {
      const windowTitle = 'windownamesizewidth';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('getSize'),
        (result) => assert.equal(result.value[0], 800)
      ];

      return chainPromises(steps);
    });

    it('Should return the height #ssf.Window.getSize', function() {
      const windowTitle = 'windownamesizeheight';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('getSize'),
        (result) => assert.equal(result.value[1], 600)
      ];

      return chainPromises(steps);
    });

    it('Should return the title #ssf.Window.getTitle', function() {
      const windowTitle = 'windownamegettitle';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('getTitle'),
        (result) => assert.equal(result.value, windowTitle)
      ];

      return chainPromises(steps);
    });

    it('Should return if the window has a shadow #ssf.Window.hasShadow', function() {
      const windowTitle = 'windownamehasshadow';
      const hasShadow = true;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        hasShadow
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('hasShadow'),
        (result) => assert.equal(result.value, hasShadow)
      ];

      return chainPromises(steps);
    });

    it.skip('Should hide the window #ssf.Window.hide', function() {

    });

    it('Should return a boolean stating if the window is alwaysOnTop #ssf.Window.alwaysOnTop', function() {
      const windowTitle = 'windownameminimized';
      const alwaysOnTop = true;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        alwaysOnTop
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('isAlwaysOnTop'),
        (result) => assert.equal(result.value, alwaysOnTop)
      ];

      return chainPromises(steps);
    });

    it('Should return a boolean stating if the window is maximizable #ssf.Window.isMaximizable', function() {
      const windowTitle = 'windownameminimized';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('isMaximizable'),
        (result) => assert.equal(result.value, true)
      ];

      return chainPromises(steps);
    });

    it('Should return a boolean stating if the window is maximized #ssf.Window.isMaximized', function() {
      const windowTitle = 'windownamemaximized';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('isMaximized'),
        (result) => assert.equal(result.value, false)
      ];

      return chainPromises(steps);
    });

    it('Should return a boolean stating if the window is minimizable #ssf.Window.isMinimizable', function() {
      const windowTitle = 'windownameminimized';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('isMinimizable'),
        (result) => assert.equal(result.value, true)
      ];

      return chainPromises(steps);
    });

    it('Should return a boolean stating if the window is minimized #ssf.Window.isMinimized', function() {
      const windowTitle = 'windownameminimized';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('isMinimized'),
        (result) => assert.equal(result.value, false)
      ];

      return chainPromises(steps);
    });

    it('Should return a boolean stating if the window is resizable #ssf.Window.isResizable', function() {
      const windowTitle = 'windownameminimized';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('isResizable'),
        (result) => assert.equal(result.value, true)
      ];

      return chainPromises(steps);
    });

    it.skip('Should load a url #ssf.Window.loadURL', function() {
      const windowTitle = 'windownameloadurl';
      const url = 'http://github.com/symphonyoss/containerjs';
      const windowOptions = getWindowOptions({
        name: windowTitle,
        url: 'http://github.com/symphonyoss/containerjs'
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('loadURL', url),
        () => retrieveWebUrl(),
        (result) => assert.equal(result.value, url)
      ];

      return chainPromises(steps);
    });

    it('Should maximize the window #ssf.Window.maximize', function() {
      const windowTitle = 'windownamemaximize';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('maximize'),
        () => callAsyncWindowMethod('isMaximized'),
        (result) => assert.equal(result.value, true)
      ];

      return chainPromises(steps);
    });

    it('Should minimize the window #ssf.Window.minimize', function() {
      const windowTitle = 'windownameminimize';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('minimize'),
        () => callAsyncWindowMethod('isMinimized'),
        (result) => assert.equal(result.value, true)
      ];

      return chainPromises(steps);
    });

    it.skip('Should reload the page #ssf.Window.reload', function() {

    });

    it('Should restore the window from maximized #ssf.Window.maximized', function() {
      const windowTitle = 'windownamerestoremax';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('maximize'),
        () => callAsyncWindowMethod('restore'),
        () => callAsyncWindowMethod('isMaximized'),
        (result) => assert.equal(result.value, false)
      ];

      return chainPromises(steps);
    });

    it('Should restore the window from minimized #ssf.Window.restore', function() {
      const windowTitle = 'windownamerestoremin';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('minimize'),
        () => callAsyncWindowMethod('restore'),
        () => callAsyncWindowMethod('isMinimized'),
        (result) => assert.equal(result.value, false)
      ];

      return chainPromises(steps);
    });

    it('Should set alwaysOnTop #ssf.Window.setAlwaysOnTop', function() {
      const windowTitle = 'windownamesetalwaysontop';
      const alwaysOnTop = true;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        alwaysOnTop
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('setAlwaysOnTop', !alwaysOnTop),
        () => callAsyncWindowMethod('isAlwaysOnTop'),
        (result) => assert.equal(result.value, !alwaysOnTop)
      ];

      return chainPromises(steps);
    });

    it('Should set the bounds #ssf.Window.setBounds', function() {
      const windowTitle = 'windownamesetbounds';
      const bounds = { x: 0, y: 0, width: 500, height: 500 };
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('setBounds', bounds),
        () => callAsyncWindowMethod('getBounds'),
        (result) => {
          assert.equal(result.value.height, bounds.height);
          assert.equal(result.value.width, bounds.width);
          assert.equal(result.value.x, bounds.x);
          assert.equal(result.value.y, bounds.y);
        }
      ];

      return chainPromises(steps);
    });

    it.skip('Should set the icon #ssf.Window.setIcon', function() {

    });

    it('Should set if the window is maximizable #ssf.Window.setMaximizable', function() {
      const windowTitle = 'windownamesetismaximizable';
      const maximizable = true;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        maximizable
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('setMaximizable', !maximizable),
        () => callAsyncWindowMethod('isMaximizable'),
        (result) => assert.equal(result.value, !maximizable)
      ];

      return chainPromises(steps);
    });

    it('Should set the windows maximum width #ssf.Window.setMaximumSize', function() {
      const windowTitle = 'windownamesetmaxwidth';
      const maxWidth = 777;
      const maxHeight = 780;
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('setMaximumSize', maxWidth, maxHeight),
        () => callAsyncWindowMethod('getMaximumSize'),
        (result) => assert.equal(result.value[0], maxWidth)
      ];

      return chainPromises(steps);
    });

    it.skip('Should set the windows maximum height #ssf.Window.setMaximumSize', function() {
      const windowTitle = 'windownamesetmaxheight';
      const maxWidth = 777;
      const maxHeight = 780;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        maxHeight,
        maxWidth
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('setMaximumSize', maxWidth, maxHeight),
        () => callAsyncWindowMethod('getMaximumSize'),
        (result) => assert.equal(result.value[1], maxHeight)
      ];

      return chainPromises(steps);
    });

    it('Should set if the window is minimizable #ssf.Window.setMinimizable', function() {
      const windowTitle = 'windownamesetisminimizable';
      const minimizable = true;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        minimizable
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('setMinimizable', !minimizable),
        () => callAsyncWindowMethod('isMinimizable'),
        (result) => assert.equal(result.value, !minimizable)
      ];

      return chainPromises(steps);
    });

    it('Should set the windows minimum width #ssf.Window.setMinimumSize', function() {
      const windowTitle = 'windownamesetminwidth';
      const minWidth = 777;
      const minHeight = 780;
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('setMinimumSize', minWidth, minHeight),
        () => callAsyncWindowMethod('getMinimumSize'),
        (result) => assert.equal(result.value[0], minWidth)
      ];

      return chainPromises(steps);
    });

    it.skip('Should set the windows minimum height #ssf.Window.setMinimumSize', function() {
      const windowTitle = 'windownamesetminheight';
      const minWidth = 777;
      const minHeight = 780;
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('setMinimumSize', minWidth, minHeight),
        () => callAsyncWindowMethod('getMinimumSize'),
        (result) => assert.equal(result.value[1], minHeight)
      ];

      return chainPromises(steps);
    });

    it('Should set the windows position #ssf.Window.setPosition', function() {
      const windowTitle = 'windownamesetposition';
      const newX = 400;
      const newY = 450;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        x: 300,
        y: 250
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('setPosition', newX, newY),
        () => callAsyncWindowMethod('getPosition'),
        (result) => {
          assert.equal(result.value[0], newX);
          assert.equal(result.value[1], newY);
        }
      ];

      return chainPromises(steps);
    });

    it('Should set if the window is resizable #ssf.Window.setResizable', function() {
      const windowTitle = 'windownamesetisresizable';
      const resizable = true;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        resizable
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('setResizable', !resizable),
        () => callAsyncWindowMethod('isResizable'),
        (result) => assert.equal(result.value, !resizable)
      ];

      return chainPromises(steps);
    });

    it('Should set the windows size #ssf.Window.setSize', function() {
      const windowTitle = 'windownamesetsize';
      const newWidth = 400;
      const newHeight = 450;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        width: 300,
        height: 250
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('setSize', newWidth, newHeight),
        () => callAsyncWindowMethod('getSize'),
        (result) => {
          assert.equal(result.value[0], newWidth);
          assert.equal(result.value[1], newHeight);
        }
      ];

      return chainPromises(steps);
    });

    it.skip('Should set if the window skips the task bar #ssf.Window.setSkipTaskbar', function() {

    });

    it.skip('Should show the window #ssf.Window.show', function() {

    });

    it('Should unmaximize the window from maximized #ssf.Window.unmaximize', function() {
      const windowTitle = 'windownameunmaximize';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('maximize'),
        () => callAsyncWindowMethod('unmaximize'),
        () => callAsyncWindowMethod('isMaximized'),
        (result) => assert.equal(result.value, false)
      ];

      return chainPromises(steps);
    });
  });

  describe('New Window', function() {
    it('Should open a new window #ssf.Window()', function() {
      return openNewWindow(app.client, {url: 'about:blank', name: 'test', show: true, child: true}).then((result) => {
        return app.client.getWindowCount().then((count) => {
          assert.equal(count, 2);
        });
      });
    });

    it('Should be created with the correct x position #ssf.Window(x)', function() {
      const windowTitle = 'windownamex';
      const xValue = 100;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        x: xValue,
        y: 0
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('getPosition'),
        (result) => assert.equal(result.value[0], xValue)
      ];

      return chainPromises(steps);
    });

    it('Should be created with the correct y position #ssf.Window(y)', function() {
      const windowTitle = 'windownamey';
      const yValue = 100;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        x: 0,
        y: yValue
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('getPosition'),
        (result) => assert.equal(result.value[1], yValue)
      ];

      return chainPromises(steps);
    });
  });
});
