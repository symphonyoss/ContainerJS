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

describe('WindowCore API', function(done) {
  const timeout = 90000;
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
      ssf.app.ready().then(() => {
        var currentWin = ssf.Window.getCurrentWindow();
        currentWin[method](...args).then((data) => {
          callback(data);
        });
      });
    };
    /* eslint-enable no-undef */
    return executeAsyncJavascript(app.client, script, method, args);
  };

  const callWindowMethod = (method, ...args) => {
    /* eslint-disable no-undef */
    const script = (method, args, callback) => {
      ssf.app.ready().then(() => {
        var currentWin = ssf.Window.getCurrentWindow();
        callback(currentWin[method](...args));
      });
    };

    /* eslint-enable no-undef */
    return executeAsyncJavascript(app.client, script, method, args);
  };

  it('Should have ssf.Window available globally', function() {
    /* eslint-disable no-undef */
    const script = (callback) => {
      ssf.app.ready().then(() => {
        if (ssf.Window !== undefined) {
          callback();
        }
      });
    };
    /* eslint-enable no-undef */
    return executeAsyncJavascript(app.client, script);
  });

  describe('Methods', function() {
    it('Should add a listener to the window listeners #ssf.Window.addListener #ssf.WindowCore.addListener', function() {
      const windowTitle = 'windownameaddlistener';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const addWindowListener = (event) => {
        /* eslint-disable no-undef */
        const script = (event, callback) => {
          var currentWin = ssf.Window.getCurrentWindow();
          currentWin.addListener(event, () => console.log(event));
          callback();
        };
        /* eslint-enable no-undef */
        return executeAsyncJavascript(app.client, script, event);
      };

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => addWindowListener('blur'),
        () => callWindowMethod('listenerCount', 'blur'),
        (result) => assert.equal(result.value, 1)
      ];

      return chainPromises(steps);
    });

    it('Should close the window #ssf.Window.close #ssf.WindowCore.close', function() {
      const windowTitle = 'windownameclose';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => callAsyncWindowMethod('close'),
        () => app.client.getWindowCount(),
        (result) => {
          if (process.env.MOCHA_CONTAINER === 'openfin') {
            // Hidden mainWindow is still there
            assert.equal(result, 2);
          } else {
            assert.equal(result, 1);
          }
        }
      ];

      return chainPromises(steps);
    });

    it('Should get the child windows #ssf.Window.getChildWindows #ssf.WindowCore.getChildWindows', function() {
      const windowTitle = 'windownameclose';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const getChildWindowsCount = () => {
        /* eslint-disable no-undef */
        const script = (callback) => {
          var currentWin = ssf.Window.getCurrentWindow();
          currentWin.getChildWindows().then((wins) => {
            callback(wins.length);
          });
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

    it('Should not get child windows if there isn\'t any #ssf.Window.getChildWindows #ssf.WindowCore.getChildWindows', function() {
      const windowTitle = 'windownameclose';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => selectWindow(app.client, 1),
        () => callAsyncWindowMethod('getChildWindows'),
        (result) => assert.equal(result.value.length, 0)
      ];

      return chainPromises(steps);
    });

    it.skip('Should return the parent window #ssf.Window.getParentWindow #ssf.WindowCore.getParentWindow', function() {
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

    it('Should return null if there is no parent window #ssf.Window.getParentWindow #ssf.WindowCore.getParentWindow', function() {
      const steps = [
        () => callAsyncWindowMethod('getParentWindow'),
        (result) => assert.equal(result.value, null)
      ];

      return chainPromises(steps);
    });

    it('Should return the x position #ssf.Window.getPosition #ssf.WindowCore.getPosition', function() {
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

    it('Should return the y position #ssf.Window.getPosition #ssf.WindowCore.getPosition', function() {
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

    it('Should return the title #ssf.Window.getTitle #ssf.WindowCore.getTitle', function() {
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

    it('Should return a boolean stating if the window is maximizable #ssf.Window.isMaximizable #ssf.WindowCore.isMaximizable', function() {
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

    it('Should return a boolean stating if the window is minimizable #ssf.Window.isMinimizable #ssf.WindowCore.isMinimizable', function() {
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

    it('Should return a boolean stating if the window is resizable #ssf.Window.isResizable #ssf.WindowCore.isResizable', function() {
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

    it('Should load a url #ssf.Window.loadURL #ssf.WindowCore.loadURL', function() {
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

    it('Should add a listener to the window that persists after it has been called #ssf.Window.on #ssf.WindowCore.on', function() {
      const windowTitle = 'windownameon';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const addWindowListener = (event) => {
        /* eslint-disable no-undef */
        const script = (event, callback) => {
          var currentWin = ssf.Window.getCurrentWindow();
          currentWin.on(event, () => console.log(event));
          callback();
        };
        /* eslint-enable no-undef */
        return executeAsyncJavascript(app.client, script, event);
      };

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => addWindowListener('focus'),
        () => callWindowMethod('listenerCount', 'focus'),
        (result) => assert.equal(result.value, 1),
        // Blur isn't working correctly in browser tests, so we need to switch windows instead
        () => selectWindow(app.client, 0),
        () => selectWindow(app.client, 1),
        () => callAsyncWindowMethod('blur'),
        () => callAsyncWindowMethod('focus'),
        () => callWindowMethod('listenerCount', 'focus'),
        (result) => assert.equal(result.value, 1)
      ];

      return chainPromises(steps);
    });

    it('Should add a one-time listener to the window #ssf.Window.once #ssf.WindowCore.once', function() {
      const windowTitle = 'windownameonce';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const addWindowListener = (event) => {
        /* eslint-disable no-undef */
        const script = (event, callback) => {
          var currentWin = ssf.Window.getCurrentWindow();
          currentWin.once(event, () => console.log(event));
          callback();
        };
        /* eslint-enable no-undef */
        return executeAsyncJavascript(app.client, script, event);
      };

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => addWindowListener('focus'),
        () => callWindowMethod('listenerCount', 'focus'),
        (result) => assert.equal(result.value, 1),
        // Blur isn't working correctly in browser tests, so we need to switch windows instead
        () => selectWindow(app.client, 0),
        () => selectWindow(app.client, 1),
        () => callAsyncWindowMethod('blur'),
        () => callAsyncWindowMethod('focus'),
        () => callWindowMethod('listenerCount', 'focus'),
        (result) => assert.equal(result.value, 0)
      ];

      return chainPromises(steps);
    });

    it.only('Should remove a listener from the window #ssf.Window.removeListener #ssf.WindowCore.removeListener', function() {
      const windowTitle = 'windownameremovelistener';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const addWindowListener = (event) => {
        /* eslint-disable no-undef */
        const script = (event, callback) => {
          // We need to save the function, as we need to pass the same function object to removeListener
          window.customListener = () => console.log(event);
          var currentWin = ssf.Window.getCurrentWindow();
          currentWin.addListener(event, window.customListener);
          callback();
        };
        /* eslint-enable no-undef */
        return executeAsyncJavascript(app.client, script, event);
      };

      const removeWindowListener = (event) => {
        /* eslint-disable no-undef */
        const script = (event, callback) => {
          var currentWin = ssf.Window.getCurrentWindow();
          currentWin.removeListener(event, window.customListener);
          callback();
        };
        /* eslint-enable no-undef */
        return executeAsyncJavascript(app.client, script, event);
      };

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => addWindowListener('blur'),
        () => removeWindowListener('blur'),
        () => callWindowMethod('listenerCount', 'blur'),
        (result) => assert.equal(result.value, 0)
      ];

      return chainPromises(steps);
    });

    it.only('Should remove all listeners from the window #ssf.Window.removeAllListeners #ssf.WindowCore.removeAllListeners', function() {
      const windowTitle = 'windownameremovealllisteners';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const addWindowListener = (event, data) => {
        /* eslint-disable no-undef */
        const script = (event, data, callback) => {
          // We need to save the function, as we need to pass the same function object to removeListener
          var currentWin = ssf.Window.getCurrentWindow();
          currentWin.addListener(event, () => console.log(event + data));
          callback();
        };
        /* eslint-enable no-undef */
        return executeAsyncJavascript(app.client, script, event, data);
      };

      const removeWindowListeners = (event) => {
        /* eslint-disable no-undef */
        const script = (event, callback) => {
          var currentWin = ssf.Window.getCurrentWindow();
          currentWin.removeAllListeners(event);
          callback();
        };
        /* eslint-enable no-undef */
        return executeAsyncJavascript(app.client, script, event);
      };

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => addWindowListener('blur', 'one'),
        () => addWindowListener('blur', 'two'),
        () => removeWindowListeners('blur'),
        () => callWindowMethod('listenerCount', 'blur'),
        (result) => assert.equal(result.value, 0)
      ];

      return chainPromises(steps);
    });

    it.only('Should remove all listeners from all events when passed no event #ssf.Window.removeAllListeners #ssf.WindowCore.removeAllListeners', function() {
      const windowTitle = 'windownameremovealllistenersallevents';
      const windowOptions = getWindowOptions({
        name: windowTitle
      });

      const addWindowListener = (event, data) => {
        /* eslint-disable no-undef */
        const script = (event, data, callback) => {
          // We need to save the function, as we need to pass the same function object to removeListener
          var currentWin = ssf.Window.getCurrentWindow();
          currentWin.addListener(event, () => console.log(event + data));
          callback();
        };
        /* eslint-enable no-undef */
        return executeAsyncJavascript(app.client, script, event, data);
      };

      const removeWindowListeners = () => {
        /* eslint-disable no-undef */
        const script = (callback) => {
          var currentWin = ssf.Window.getCurrentWindow();
          currentWin.removeAllListeners();
          callback();
        };
        /* eslint-enable no-undef */
        return executeAsyncJavascript(app.client, script);
      };

      const steps = [
        ...setupWindowSteps(windowOptions),
        () => addWindowListener('blur', 'one'),
        () => addWindowListener('blur', 'two'),
        () => addWindowListener('focus', 'one'),
        () => removeWindowListeners('blur'),
        () => callWindowMethod('listenerCount', 'blur'),
        (result) => assert.equal(result.value, 0),
        () => callWindowMethod('listenerCount', 'focus'),
        (result) => assert.equal(result.value, 0)
      ];

      return chainPromises(steps);
    });

    it('Should set the bounds #ssf.Window.setBounds #ssf.WindowCore.setBounds', function() {
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

    it('Should set the windows position #ssf.Window.setPosition #ssf.WindowCore.setPosition', function() {
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

    it('Should set the windows size #ssf.Window.setSize #ssf.WindowCore.setSize', function() {
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

    if (process.env.MOCHA_CONTAINER === 'electron') {
      it('Should return the id of the window #ssf.Window.getId #ssf.WindowCore.getId', function() {
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
      it('Should return the id of the window #ssf.Window.getId #ssf.WindowCore.getId', function() {
        const windowTitle = 'windownameid';
        const windowOptions = getWindowOptions({
          name: windowTitle
        });

        const steps = [
          ...setupWindowSteps(windowOptions),
          () => selectWindow(app.client, 1),
          () => callWindowMethod('getId'),
          (result) => assert.equal(result.value, `${windowTitle}:${windowTitle}`)
        ];

        return chainPromises(steps);
      });
    }

    if (process.env.MOCHA_CONTAINER === 'browser') {
      it('Should return the id of the window #ssf.Window.getId #ssf.WindowCore.getId', function() {
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
    it('Should open a new window #ssf.Window', function() {
      return openNewWindow(app.client, {url: 'about:blank', name: 'test', show: true, child: true}).then((result) => {
        return app.client.getWindowCount().then((count) => {
          if (process.env.MOCHA_CONTAINER === 'openfin') {
            // Hidden mainWindow is still there
            assert.equal(count, 3);
          } else {
            assert.equal(count, 2);
          }
        });
      });
    });

    it('Should be created with the correct x position #ssf.WindowOptions.x', function() {
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

    it('Should be created with the correct y position #ssf.WindowOptions.y', function() {
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
