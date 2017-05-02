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

const defaultWindowOptions = {
  url: 'http://localhost:5000/index.html',
  name: 'messagetest',
  show: true,
  child: true
};

let secondWindowId = '';

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
    /* eslint-disable no-undef, no-new */
    const script = (options, callback) => {
      ssf.app.ready().then(() => {
        new ssf.Window(options);
        setTimeout(() => callback(), 500);
      });
    };
    /* eslint-enable no-undef */
    return executeAsyncJavascript(app.client, script, options)
      .then(() => app.client.isVisible('.visible-check'));
  };

  /* eslint-disable no-undef */
  const setupScript = (id, topic, callback) => {
    ssf.MessageService.subscribe(id, topic, (message) => {
      window.testMessage = message;
    });
    callback(ssf.Window.getCurrentWindowId());
  };
  const sendMessageScript = (id, topic, message, callback) => {
    ssf.MessageService.send(id, topic, message);
    callback();
  };
  const getMessageScript = (callback) => {
    callback(window.testMessage || 'empty');
  };
  /* eslint-enable no-undef */

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
      const message = 'message';

      return openNewWindow(defaultWindowOptions)
        .then(() => selectWindow(1))
        .then(() => executeAsyncJavascript(app.client, setupScript, '*', 'topic'))
        .then((result) => { secondWindowId = result.value; })
        .then(() => selectWindow(0))
        .then(() => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic', message))
        .then(() => selectWindow(1))
        .then(() => executeAsyncJavascript(app.client, getMessageScript))
        .then((result) => assert(result.value, message));
    });

    it('Send message sends javascript object correctly', function() {
      const message = {
        a: 1,
        b: '20'
      };

      return openNewWindow(defaultWindowOptions)
        .then(() => selectWindow(1))
        .then(() => executeAsyncJavascript(app.client, setupScript, '*', 'topic'))
        .then((result) => { secondWindowId = result.value; })
        .then(() => selectWindow(0))
        .then(() => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic', message))
        .then(() => selectWindow(1))
        .then(() => executeAsyncJavascript(app.client, getMessageScript))
        .then((result) => assert(result.value, message));
    });

    it('Send message sends to correct window', function() {
      const message = 'message';

      const thirdWindowOptions = {
        url: 'http://localhost:5000/index.html',
        name: 'messagetest2',
        show: true,
        child: true
      };

      return openNewWindow(defaultWindowOptions)
        .then(() => openNewWindow(thirdWindowOptions))
        .then(() => selectWindow(1))
        .then(() => executeAsyncJavascript(app.client, setupScript, '*', 'topic'))
        .then((result) => { secondWindowId = result.value; })
        .then(() => selectWindow(2))
        .then(() => executeAsyncJavascript(app.client, setupScript, '*', 'topic'))
        .then(() => selectWindow(0))
        .then(() => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic', message))
        .then(() => selectWindow(1))
        .then(() => executeAsyncJavascript(app.client, getMessageScript))
        .then((result) => assert(result.value, message))
        .then(() => selectWindow(2))
        .then(() => executeAsyncJavascript(app.client, getMessageScript))
        .then((result) => assert(result.value, 'empty'));
    });
  });

  describe('Receive message', () => {
    it('Subscribing to correct topic calls listener', function() {
      const message = 'message';

      return openNewWindow(defaultWindowOptions)
        .then(() => selectWindow(1))
        .then(() => executeAsyncJavascript(app.client, setupScript, '*', 'topic'))
        .then((result) => { secondWindowId = result.value; })
        .then(() => selectWindow(0))
        .then(() => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic', message))
        .then(() => selectWindow(1))
        .then(() => executeAsyncJavascript(app.client, getMessageScript))
        .then((result) => assert(result.value, message));
    });

    it('Subscribing to wildcard topic calls listener', function() {
      const message = 'message';

      return openNewWindow(defaultWindowOptions)
        .then(() => selectWindow(1))
        .then(() => executeAsyncJavascript(app.client, setupScript, '*', '*'))
        .then((result) => { secondWindowId = result.value; })
        .then(() => selectWindow(0))
        .then(() => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic', message))
        .then(() => selectWindow(1))
        .then(() => executeAsyncJavascript(app.client, getMessageScript))
        .then((result) => assert(result.value, message));
    });

    it('Subscribing to wrong topic does not call listener', function() {
      const message = 'message';

      return openNewWindow(defaultWindowOptions)
        .then(() => selectWindow(1))
        .then(() => executeAsyncJavascript(app.client, setupScript, '*', 'topic'))
        .then((result) => { secondWindowId = result.value; })
        .then(() => selectWindow(0))
        .then(() => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic2', message))
        .then(() => selectWindow(1))
        .then(() => executeAsyncJavascript(app.client, getMessageScript))
        .then((result) => assert(result.value, 'empty'));
    });

    it('Subscribing to wrong window id does not call listener', function() {
      const message = 'message';

      return openNewWindow(defaultWindowOptions)
        .then(() => selectWindow(1))
        .then(() => executeAsyncJavascript(app.client, setupScript, 'wrong', 'topic'))
        .then((result) => { secondWindowId = result.value; })
        .then(() => selectWindow(0))
        .then(() => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic', message))
        .then(() => selectWindow(1))
        .then(() => executeAsyncJavascript(app.client, getMessageScript))
        .then((result) => assert(result.value, 'empty'));
    });
  });
});
