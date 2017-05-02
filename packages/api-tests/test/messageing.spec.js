const assert = require('assert');
const liveServer = require('live-server');
const {
  before,
  after,
  beforeEach,
  afterEach,
  describe,
  it
} = require('mocha');
const testContainer = process.env.MOCHA_CONTAINER;
const setup = require(`./${testContainer}-test-setup`);

let app;

const params = {
  port: 5000,
  host: '127.0.0.1',
  root: 'src',
  open: false,
  ignore: '*',
  logLevel: 0
};

describe('Messaging API', function(done) {
  const timeout = 60000;
  this.timeout(timeout);

  before(() => {
    liveServer.start(params);
  });

  after(() => {
    liveServer.shutdown();
  });

  beforeEach(() => {
    app = setup(timeout);

    return app.start();
  });

  afterEach(function() {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  const executeAsyncJavascript = (client, script, ...args) => {
    // script is passed a callback as its final argument
    return client.executeAsync(script, ...args);
  };

  const selectWindow = (handle) => {
    return app.client.windowHandles()
        .then((handles) => app.client.window(handles.value[handle]));
  };

  const openNewWindow = (options) => {
     /* eslint-disable */
    const script = (options, callback) => {
      ssf.app.ready().then(() => {
        new ssf.Window(options);
        setTimeout(() => callback(), 500);
      });
    };
    /* eslint-enable */
    return executeAsyncJavascript(app.client, script, options);
  };

  it('ssf.MessageService is available globally', () => {
    /* eslint-disable no-undef */
    const script = (callback) => {
      if (ssf.MessageService !== undefined) {
        callback();
      }
    };
    /* eslint-enable no-undef */
    return executeAsyncJavascript(app.client, script);
  });

  describe('Send message', () => {
    it('Send message sends string correctly', function() {
      const windowOptions = {
        url: 'http://localhost:5000/index.html',
        name: 'messagetest',
        show: true,
        child: true
      };

      let win2Id;

      /* eslint-disable no-undef */
      const setupScript = (callback) => {
        ssf.MessageService.subscribe('*', 'topic', (message) => {
          window.testMessage = message;
        });
        callback(ssf.Window.getCurrentWindowId());
      };
      const sendMessageScript = (id, callback) => {
        ssf.MessageService.send(id, 'topic2', 'message');
        callback();
      };
      const getMessageScript = (callback) => {
        callback(window.testMessage || 'empty');
      };
      /* eslint-enable no-undef */

      return openNewWindow(windowOptions)
        // Select window 2, subscribe to messages and get the window id
        .then(() => selectWindow(1))
        .then(() => app.client.isVisible('.visible-check'))
        .then(() => executeAsyncJavascript(app.client, setupScript))
        .then((result) => { win2Id = result.value; })
        // Select window 1 and send a message
        .then(() => selectWindow(0))
        .then(() => executeAsyncJavascript(app.client, sendMessageScript, win2Id))
        // Select window 2 and see if the listener was called
        .then(() => selectWindow(1))
        .then(() => executeAsyncJavascript(app.client, getMessageScript))
        .then((result) => assert(result.value, 'message'));
    });
  });

  describe('Receive message', () => {
    it('Subscribing to wrong topic does not call listener', function() {
      const windowOptions = {
        url: 'http://localhost:5000/index.html',
        name: 'messagetest',
        show: true,
        child: true
      };

      let win2Id;

      /* eslint-disable no-undef */
      const setupScript = (callback) => {
        ssf.MessageService.subscribe('*', 'topic', (message) => {
          window.testMessage = message;
        });
        callback(ssf.Window.getCurrentWindowId());
      };
      const sendMessageScript = (id, callback) => {
        ssf.MessageService.send(id, 'topic2', 'message');
        callback();
      };
      const getMessageScript = (callback) => {
        callback(window.testMessage || 'empty');
      };
      /* eslint-enable no-undef */

      return openNewWindow(windowOptions)
        // Select window 2, subscribe to messages and get the window id
        .then(() => selectWindow(1))
        .then(() => app.client.isVisible('.visible-check'))
        .then(() => executeAsyncJavascript(app.client, setupScript))
        .then((result) => { win2Id = result.value; })
        // Select window 1 and send a message
        .then(() => selectWindow(0))
        .then(() => executeAsyncJavascript(app.client, sendMessageScript, win2Id))
        // Select window 2 and see if the listener was called
        .then(() => selectWindow(1))
        .then(() => executeAsyncJavascript(app.client, getMessageScript))
        .then((result) => assert(result.value, 'empty'));
    });
  });
});
