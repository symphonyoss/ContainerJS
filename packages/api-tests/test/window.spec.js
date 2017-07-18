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

const initialBounds = { x: 0, y: 0, width: 200, height: 200 };

const setupWindowSteps = (windowOptions) => [
  () => app.client.isVisible('.visible-check'),
  () => openNewWindow(app.client, windowOptions),
  () => selectWindow(app.client, 1),
  () => app.client.waitForVisible('.visible-check')
];

const initialisePositionSteps = () => [
  () => callAsyncWindowMethod('restore'),
  () => callAsyncWindowMethod('setBounds', initialBounds)
];

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

const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

if (process.env.MOCHA_CONTAINER !== 'browser') {
  describe('Window API', function(done) {
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
      it('Should blur the window #ssf.Window.blur', function() {
        const windowTitle = 'windownameblur';
        const windowOptions = getWindowOptions({
          name: windowTitle
        });

        const checkWindowBlurred = () => {
          /* eslint-disable no-undef */
          const script = (callback) => {
            callback(!document.hasFocus());
          };
          /* eslint-enable no-undef */
          return executeAsyncJavascript(app.client, script);
        };

        const steps = [
          ...setupWindowSteps(windowOptions),
          () => callAsyncWindowMethod('focus'),
          () => checkWindowBlurred(),
          (result) => assert.equal(result.value, false),
          () => callAsyncWindowMethod('blur'),
          () => checkWindowBlurred(),
          (result) => assert.equal(result.value, true)
        ];

        return chainPromises(steps);
      });

      it.skip('Should flash the window frame #ssf.Window.flashFrame', function() {

      });

      it.skip('Should focus on the window #ssf.Window.focus', function() {

      });

      it('Should get all open windows #ssf.Window.getAll', function() {
        const windowTitle = 'windownamegetall';
        const windowOptions = getWindowOptions({
          name: windowTitle
        });

        /* eslint-disable no-undef */
        const allScript = (callback) => {
          ssf.app.ready().then(() => {
            ssf.Window.getAll().then((windows) => {
              callback(windows.length);
            });
          });
        };
        /* eslint-enable no-undef */

        const steps = [
          ...setupWindowSteps(windowOptions),
          () => executeAsyncJavascript(app.client, allScript),
          (result) => assert.equal(result.value, 2)
        ];

        return chainPromises(steps);
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

      it('Should get a window by its id #ssf.Window.getById', function() {
        const windowTitle = 'windownamegetbyid';
        const windowOptions = getWindowOptions({
          name: windowTitle
        });

        /* eslint-disable no-undef */
        const idScript = (callback) => {
          ssf.app.ready().then(() => {
            const id = window.newWin.getId();
            const win = ssf.Window.getById(id);
            callback(win !== null);
          });
        };
        /* eslint-enable no-undef */

        const steps = [
          ...setupWindowSteps(windowOptions),
          () => selectWindow(app.client, 0),
          () => executeAsyncJavascript(app.client, idScript),
          (result) => assert.equal(result.value, true)
        ];

        return chainPromises(steps);
      });

      it('Should return null if no window with id exists #ssf.Window.getById', function() {
        const windowTitle = 'windownamegetbyidwrong';
        const windowOptions = getWindowOptions({
          name: windowTitle
        });

        /* eslint-disable no-undef */
        const idScript = (callback) => {
          ssf.app.ready().then(() => {
            ssf.Window.getById('thisiswrong').then(win => {
              callback(win === null);
            });
          });
        };
        /* eslint-enable no-undef */

        const steps = [
          ...setupWindowSteps(windowOptions),
          () => selectWindow(app.client, 0),
          () => executeAsyncJavascript(app.client, idScript),
          (result) => assert.equal(result.value, true)
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

      it('Should return the maximum height #ssf.Window.getMaximumSize', function() {
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

      it('Should return the minimum height #ssf.Window.getMinimumSize', function() {
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

      it('Should return the width #ssf.Window.getSize', function() {
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

      it('Should return the height #ssf.Window.getSize', function() {
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

      it('Should return a boolean stating if the window is alwaysOnTop #ssf.Window.isAlwaysOnTop', function() {
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

      it('Should return a boolean stating if the window is visible #ssf.Window.isVisible', function() {
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

      it('Should restore the window from maximized #ssf.Window.restore', function() {
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

      it.skip('Should set the icon #ssf.Window.setIcon', function() {

      });

      it('Should not throw an error when a url is passed to setIcon #ssf.Window.setIcon', function() {
        const imageUrl = 'http://localhost:5000/test-image.png';
        const steps = [
          () => callAsyncWindowMethod('setIcon', imageUrl),
          () => assert(true)
        ];

        return chainPromises(steps);
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

      it('Should set the windows maximum height #ssf.Window.setMaximumSize', function() {
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

      it('Should set the windows minimum height #ssf.Window.setMinimumSize', function() {
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
      it('Should be created with added frame size to max height #ssf.WindowOptions.maxHeight', function() {
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

      it('Should be created with added frame size to min height #ssf.WindowOptions.minHeight', function() {
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

      it('Should be created in the center if no x and y #ssf.WindowOptions.center', function() {
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
          currentWindow.addListener(event, () => { window.listenEventResult = true; });
          callback();
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

      it('Should emit the blur event #ssf.WindowEvent.blur', function() {
        const windowTitle = 'windoweventblur';
        const windowOptions = getWindowOptions({
          name: windowTitle
        });

        const event = 'blur';

        const steps = [
          ...setupWindowSteps(windowOptions),
          () => addListener(event),
          () => callAsyncWindowMethod('focus'),
          () => callAsyncWindowMethod(event),
          () => wait(retrieveDelay),
          () => retrieveListenerResult(),
          (result) => assert.equal(result.value, true)
        ];

        return chainPromises(steps);
      });

      it('Should emit the move event #ssf.WindowEvent.move', function() {
        const windowTitle = 'windoweventmove';
        const windowOptions = getWindowOptions({
          name: windowTitle
        });

        const bounds = { x: 3, y: 3, width: 500, height: 500 };

        const steps = [
          ...setupWindowSteps(windowOptions),
          ...initialisePositionSteps(),
          () => addListener('move'),
          () => callAsyncWindowMethod('setBounds', bounds),
          () => wait(retrieveDelay),
          () => retrieveListenerResult(),
          (result) => assert.equal(result.value, true)
        ];

        return chainPromises(steps);
      });

      it('Should emit the resize event #ssf.WindowEvent.resize', function() {
        const windowTitle = 'windoweventresize';
        const windowOptions = getWindowOptions({
          name: windowTitle
        });

        const bounds = { x: 3, y: 3, width: 500, height: 500 };

        const steps = [
          ...setupWindowSteps(windowOptions),
          ...initialisePositionSteps(),
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

      it('Should emit the focus event #ssf.WindowEvent.focus', function() {
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

      it('Should emit the hide event #ssf.WindowEvent.hide', function() {
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

      it('Should emit the maximize event #ssf.WindowEvent.maximize', function() {
        const windowTitle = 'windoweventmaximize';
        const windowOptions = getWindowOptions({
          name: windowTitle
        });

        const event = 'maximize';

        const steps = [
          ...setupWindowSteps(windowOptions),
          ...initialisePositionSteps(),
          () => addListener(event),
          () => callAsyncWindowMethod(event),
          () => wait(retrieveDelay),
          () => retrieveListenerResult(),
          (result) => assert.equal(result.value, true)
        ];

        return chainPromises(steps);
      });

      it('Should emit the minimize event #ssf.WindowEvent.minimize', function() {
        const windowTitle = 'windoweventminimize';
        const windowOptions = getWindowOptions({
          name: windowTitle
        });

        const event = 'minimize';

        const steps = [
          ...setupWindowSteps(windowOptions),
          ...initialisePositionSteps(),
          () => addListener(event),
          () => callAsyncWindowMethod(event),
          () => wait(retrieveDelay),
          () => retrieveListenerResult(),
          (result) => assert.equal(result.value, true)
        ];

        return chainPromises(steps);
      });

      it('Should emit the restore event when minimized #ssf.WindowEvent.restore', function() {
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

      it.skip('Should not emit the restore event from maximized #ssf.WindowEvent.restore', function() {
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

      it('Should emit the show event #ssf.WindowEvent.show', function() {
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
}
