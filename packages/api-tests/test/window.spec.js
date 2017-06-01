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
  child: true,
  width: 200,
  height: 200
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
    callback(window.location.href);
  };
  /* eslint-enable no-undef */
  return executeAsyncJavascript(app.client, script);
};

const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

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

    it('Should get the bounds of the window @no-browser #ssf.Window.getBounds', function() {
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

    it('Should get the child windows #ssf.Window.getChildWindows', function() {
      const windowTitle = 'windownameclose';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const getChildWindowsCount = () => {
        /* eslint-disable no-undef */
        const script = (callback) => {
          var currentWin = ssf.Window.getCurrentWindow();
          callback(currentWin.getChildWindows().length);
        };
        /* eslint-enable no-undef */
        return executeAsyncJavascript(app.client, script);
      };

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => selectWindow(app.client, 0),
        () => getChildWindowsCount(),
        (result) => assert.equal(result.value, 1)
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

    it('Should return the maximum width @no-browser #ssf.Window.getMaximumSize', function() {
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

    it('Should return the maximum height @no-browser #ssf.Window.getMaximumSize', function() {
      const windowTitle = 'windownamemaxheight';
      const maxWidth = 500;
      const maxHeight = 600;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        maxWidth,
        maxHeight,
        frame: false
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('getMaximumSize'),
        (result) => assert.equal(result.value[1], maxHeight)
      ];

      return chainPromises(steps);
    });

    it('Should return the minimum width @no-browser #ssf.Window.getMinimumSize', function() {
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

    it('Should return the minimum height @no-browser #ssf.Window.getMinimumSize', function() {
      const windowTitle = 'windownameminheight';
      const minWidth = 500;
      const minHeight = 600;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        minWidth,
        minHeight,
        frame: false
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('getMinimumSize'),
        (result) => assert.equal(result.value[1], minHeight)
      ];

      return chainPromises(steps);
    });

    it('Should return the parent window #ssf.Window.getParentWindow', function() {
      const windowTitle = 'windownamegetparent';
      const windowOptions = getWindowOptions({
        name: windowTitle,
        title: windowTitle
      });

      const getParentWindowTitle = () => {
        /* eslint-disable no-undef */
        const script = (callback) => {
          var currentWin = ssf.Window.getCurrentWindow();
          currentWin.getParentWindow().then((parent) => {
            parent.getTitle().then((title) => {
              callback(title);
            });
          });
        };
        return executeAsyncJavascript(app.client, script);
      };

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => openNewWindow(app.client, Object.assign({}, windowOptions, {name: 'child'})),
        () => selectWindow(app.client, 2),
        () => app.client.waitForVisible('.visible-check'),
        () => getParentWindowTitle(),
        (result) => assert.equal(result.value, windowTitle)
      ];

      return chainPromises(steps);
    });

    it('Should return null if there is no parent window #ssf.Window.getParentWindow', function() {
      const steps = [
        () => callAsyncWindowMethod('getParentWindow'),
        (result) => assert.equal(result.value, null)
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

    it('Should return the width @no-browser #ssf.Window.getSize', function() {
      const windowTitle = 'windownamesizewidth';
      const windowOptions = getWindowOptions({
        name: windowTitle,
        width: undefined,
        height: undefined
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('getSize'),
        (result) => assert.equal(result.value[0], 800)
      ];

      return chainPromises(steps);
    });

    it('Should return the height @no-browser #ssf.Window.getSize', function() {
      const windowTitle = 'windownamesizeheight';
      const windowOptions = getWindowOptions({
        name: windowTitle,
        width: undefined,
        height: undefined
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

    it('Should return if the window has a shadow @no-browser #ssf.Window.hasShadow', function() {
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

    it('Should return a boolean stating if the window is alwaysOnTop @no-browser #ssf.Window.isAlwaysOnTop', function() {
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

    it('Should return a boolean stating if the window is maximized @no-browser #ssf.Window.isMaximized', function() {
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

    it('Should return a boolean stating if the window is minimized @no-browser #ssf.Window.isMinimized', function() {
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

    it('Should return a boolean stating if the window is visible @no-browser #ssf.Window.isVisible', function() {
      const windowTitle = 'windownameminimized';
      const show = false;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        show
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('isVisible'),
        (result) => assert.equal(result.value, show)
      ];

      return chainPromises(steps);
    });

    it('Should load a url #ssf.Window.loadURL', function() {
      const windowTitle = 'windownameloadurl';
      const url = 'http://localhost:5000/load-url-test.html';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      // We MUST run the callback before we call loadURL otherwise webdriver loses the context
      const executeLoadURL = (url) => {
        /* eslint-disable no-undef */
        const script = (url, callback) => {
          var currentWin = ssf.Window.getCurrentWindow();
          setTimeout(() => {
            currentWin.loadURL(url);
          }, 100);
          callback();
        };
        /* eslint-enable no-undef */
        return executeAsyncJavascript(app.client, script, url);
      };

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => executeLoadURL(url),
        // We need to give the window time to load, otherwise we might get the old url
        () => wait(2000),
        () => retrieveWebUrl(),
        (result) => assert.equal(result.value, url)
      ];

      return chainPromises(steps);
    });

    it('Should maximize the window @no-browser #ssf.Window.maximize', function() {
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

    it('Should minimize the window @no-browser #ssf.Window.minimize', function() {
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

    it('Should restore the window from maximized @no-browser #ssf.Window.maximized', function() {
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

    it('Should restore the window from minimized @no-browser #ssf.Window.restore', function() {
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

    it('Should set alwaysOnTop @no-browser #ssf.Window.setAlwaysOnTop', function() {
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
        (result) => assert.deepEqual(result.value, bounds)
      ];

      return chainPromises(steps);
    });

    it.skip('Should set the icon #ssf.Window.setIcon', function() {

    });

    it('Should not throw an error when a url is passed to setIcon @no-browser #ssf.Window.setIcon', function() {
      const imageUrl = 'http://localhost:5000/test-image.png';
      const steps = [
        () => callAsyncWindowMethod('setIcon', imageUrl),
        () => assert(true)
      ];

      return chainPromises(steps);
    });

    it('Should set if the window is maximizable @no-browser #ssf.Window.setMaximizable', function() {
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

    it('Should set the windows maximum width @no-browser #ssf.Window.setMaximumSize', function() {
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

    it('Should set the windows maximum height @no-browser #ssf.Window.setMaximumSize', function() {
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

    it('Should set if the window is minimizable @no-browser #ssf.Window.setMinimizable', function() {
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

    it('Should set the windows minimum width @no-browser #ssf.Window.setMinimumSize', function() {
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

    it('Should set the windows minimum height @no-browser #ssf.Window.setMinimumSize', function() {
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

    it('Should set if the window is resizable @no-browser #ssf.Window.setResizable', function() {
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
        name: windowTitle
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

    it('Should unmaximize the window from maximized @no-browser #ssf.Window.unmaximize', function() {
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

    if (process.env.MOCHA_CONTAINER === 'electron') {
      it('Should return the id of the window #ssf.Window.getId', function() {
        const windowTitle = 'windownameid';
        const windowOptions = getWindowOptions({
          name: windowTitle
        });

        const steps = [
          ...setupWindowSteps(windowOptions),
          () => selectWindow(app.client, 1),
          () => callWindowMethod('getId'),
          (result) => assert.equal(result.value, 2)
        ];

        return chainPromises(steps);
      });
    }

    if (process.env.MOCHA_CONTAINER === 'openfin') {
      it('Should return the id of the window #ssf.Window.getId', function() {
        const windowTitle = 'windownameid';
        const windowOptions = getWindowOptions({
          name: windowTitle
        });

        const steps = [
          ...setupWindowSteps(windowOptions),
          () => selectWindow(app.client, 1),
          () => callWindowMethod('getId'),
          (result) => assert.equal(result.value, `ssf-desktop-api-openfin-demo:${windowTitle}`)
        ];

        return chainPromises(steps);
      });
    }

    if (process.env.MOCHA_CONTAINER === 'browser') {
      it('Should return the id of the window #ssf.Window.getId', function() {
        const windowTitle = 'windownameid';
        const windowOptions = getWindowOptions({
          name: windowTitle
        });

        const steps = [
          ...setupWindowSteps(windowOptions),
          () => selectWindow(app.client, 1),
          () => callWindowMethod('getId'),
          (result) => assert.equal(result.value, windowTitle)
        ];

        return chainPromises(steps);
      });
    }
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

    it('Should be created with added frame size to max height @no-browser #ssf.Window(maxHeight)', function() {
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

    it('Should be created with added frame size to min height @no-browser #ssf.Window(minHeight)', function() {
      const windowTitle = 'windownamemaxheight';
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

    it('Should be created in the center if no x and y @no-browser #ssf.Window(center)', function() {
      const windowTitle = 'windownamecenter';
      let targetX;
      let targetY;
      const width = 500;
      const height = 500;
      const windowOptions = getWindowOptions({
        name: windowTitle,
        center: false,
        width,
        height
      });

      const frameSize = process.platform === 'win32' ? 20 : 25;

      const getScreenSize = () => {
        /* eslint-disable no-undef */
        const script = (callback) => {
          const width = screen.width;
          const height = screen.height;
          callback({ width, height });
        };
        /* eslint-enable no-undef */
        return executeAsyncJavascript(app.client, script);
      };

      const calculateTargetPosition = (screenSize) => {
        targetX = (screenSize.width / 2) - (width / 2);
        targetY = (screenSize.height / 2) - (height / 2) - frameSize;
      };

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => getScreenSize(),
        (screenSizeObject) => calculateTargetPosition(screenSizeObject.value),
        () => callAsyncWindowMethod('getPosition'),
        (result) => assert.deepEqual(result.value, [targetX, targetY])
      ];

      return chainPromises(steps);
    });
  });

  describe('Event Listeners', function() {
    const addListener = (event) => {
      /* eslint-disable no-undef */
      const script = (event, callback) => {
        const currentWindow = ssf.Window.getCurrentWindow();
        callback(currentWindow.addListener(event, () => { window.listenEventResult = true; }));
      };
      /* eslint-enable no-undef */
      return executeAsyncJavascript(app.client, script, event);
    };

    const retrieveListenerResult = () => {
      /* eslint-disable no-undef */
      const script = (callback) => {
        callback(window.listenEventResult);
      };
      /* eslint-enable no-undef */
      return executeAsyncJavascript(app.client, script);
    };

    const retrieveDelay = 500;

    it.skip('Should emit the blur event #ssf.WindowEvent.blur', function() {
      // Electron works but OpenFin doesnt seem to set the value
      const windowTitle = 'windoweventhide';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const event = 'blur';

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => addListener(event),
        () => callAsyncWindowMethod(event),
        () => wait(retrieveDelay),
        () => retrieveListenerResult(),
        (result) => assert.equal(result.value, true)
      ];

      return chainPromises(steps);
    });

    it('Should emit the move event @no-browser #ssf.WindowEvent.move', function() {
      const windowTitle = 'windoweventmove';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const bounds = { x: 3, y: 3, width: 500, height: 500 };

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => addListener('move'),
        () => callAsyncWindowMethod('setBounds', bounds),
        () => wait(retrieveDelay),
        () => retrieveListenerResult(),
        (result) => assert.equal(result.value, true)
      ];

      return chainPromises(steps);
    });

    it('Should emit the resize event @no-browser #ssf.WindowEvent.resize', function() {
      const windowTitle = 'windoweventresize';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const bounds = { x: 3, y: 3, width: 500, height: 500 };

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => addListener('resize'),
        () => callAsyncWindowMethod('setBounds', bounds),
        () => wait(retrieveDelay),
        () => retrieveListenerResult(),
        (result) => assert.equal(result.value, true)
      ];

      return chainPromises(steps);
    });

    it.skip('Should emit the closed event #ssf.WindowEvent.closed', function() {
      // Need to put the listen on another window as closing the window removes the listener
      const windowTitle = 'windoweventboundschanging';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => addListener('closed'),
        () => callAsyncWindowMethod('close'),
        () => wait(retrieveDelay),
        () => retrieveListenerResult(),
        (result) => assert.equal(result.value, true)
      ];

      return chainPromises(steps);
    });

    it('Should emit the focus event @no-browser #ssf.WindowEvent.focus', function() {
      const windowTitle = 'windoweventfocus';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const event = 'focus';

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => addListener(event),
        () => callAsyncWindowMethod('blur'),
        () => callAsyncWindowMethod(event),
        () => wait(retrieveDelay),
        () => retrieveListenerResult(),
        (result) => assert.equal(result.value, true)
      ];

      return chainPromises(steps);
    });

    it('Should emit the hide event @no-browser #ssf.WindowEvent.hide', function() {
      const windowTitle = 'windoweventhide';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const event = 'hide';

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => addListener(event),
        () => callAsyncWindowMethod(event),
        () => wait(retrieveDelay),
        () => retrieveListenerResult(),
        (result) => assert.equal(result.value, true)
      ];

      return chainPromises(steps);
    });

    it('Should emit the maximize event @no-browser #ssf.WindowEvent.maximize', function() {
      const windowTitle = 'windoweventmaximize';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const event = 'maximize';

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => addListener(event),
        () => callAsyncWindowMethod(event),
        () => wait(retrieveDelay),
        () => retrieveListenerResult(),
        (result) => assert.equal(result.value, true)
      ];

      return chainPromises(steps);
    });

    it('Should emit the minimize event @no-browser #ssf.WindowEvent.minimize', function() {
      const windowTitle = 'windoweventminimize';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const event = 'minimize';

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => addListener(event),
        () => callAsyncWindowMethod(event),
        () => wait(retrieveDelay),
        () => retrieveListenerResult(),
        (result) => assert.equal(result.value, true)
      ];

      return chainPromises(steps);
    });

    it('Should emit the restore event when minimized @no-browser #ssf.WindowEvent.restore', function() {
      const windowTitle = 'windoweventrestoremin';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const event = 'restore';

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => addListener(event),
        () => callAsyncWindowMethod('minimize'),
        () => callAsyncWindowMethod(event),
        () => wait(retrieveDelay),
        () => retrieveListenerResult(),
        (result) => assert.equal(result.value, true)
      ];

      return chainPromises(steps);
    });

    it.skip('Should not emit the restore event from maximized @no-browser #ssf.WindowEvent.restore', function() {
      // Electron doesn't emit the event but OpenFin does
      const windowTitle = 'windoweventrestoremax';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const event = 'restore';

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => addListener(event),
        () => callAsyncWindowMethod('maximize'),
        () => callAsyncWindowMethod(event),
        () => wait(retrieveDelay),
        () => retrieveListenerResult(),
        (result) => assert.equal(result.value, null)
      ];

      return chainPromises(steps);
    });

    it('Should emit the show event @no-browser #ssf.WindowEvent.show', function() {
      const windowTitle = 'windoweventshow';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const event = 'show';

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => addListener(event),
        () => callAsyncWindowMethod('hide'),
        () => callAsyncWindowMethod(event),
        () => wait(retrieveDelay),
        () => retrieveListenerResult(),
        (result) => assert.equal(result.value, true)
      ];

      return chainPromises(steps);
    });
  });
});
