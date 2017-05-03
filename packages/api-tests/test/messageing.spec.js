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
  openNewWindow,
  chainPromises
} = require('./test-helpers');

let app;

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

  beforeEach(() => {
    app = setup(timeout);

    return app.start();
  });

  afterEach(function() {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

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

      const steps = [
        () => openNewWindow(app.client, defaultWindowOptions),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, setupScript, '*', 'topic'),
        (result) => { secondWindowId = result.value; },
        () => selectWindow(app.client, 0),
        () => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic', message),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, getMessageScript),
        (result) => assert(result.value, message)
      ];

      return chainPromises(steps);
    });

    it('Send message sends javascript object correctly', function() {
      const message = {
        a: 1,
        b: '20'
      };

      const steps = [
        () => openNewWindow(app.client, defaultWindowOptions),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, setupScript, '*', 'topic'),
        (result) => { secondWindowId = result.value; },
        () => selectWindow(app.client, 0),
        () => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic', message),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, getMessageScript),
        (result) => assert(result.value, message)
      ];

      return chainPromises(steps);
    });

    it('Send message sends to correct window', function() {
      const message = 'message';

      const thirdWindowOptions = {
        url: 'http://localhost:5000/index.html',
        name: 'messagetest2',
        show: true,
        child: true
      };

      const steps = [
        () => openNewWindow(app.client, defaultWindowOptions),
        () => openNewWindow(app.client, thirdWindowOptions),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, setupScript, '*', 'topic'),
        (result) => { secondWindowId = result.value; },
        () => selectWindow(app.client, 2),
        () => executeAsyncJavascript(app.client, setupScript, '*', 'topic'),
        () => selectWindow(app.client, 0),
        () => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic', message),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, getMessageScript),
        (result) => assert(result.value, message),
        () => selectWindow(app.client, 2),
        () => executeAsyncJavascript(app.client, getMessageScript),
        (result) => assert(result.value, 'empty')
      ];

      return chainPromises(steps);
    });
  });

  describe('Receive message', () => {
    it('Subscribing to correct topic calls listener', function() {
      const message = 'message';

      const steps = [
        () => openNewWindow(app.client, defaultWindowOptions),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, setupScript, '*', 'topic'),
        (result) => { secondWindowId = result.value; },
        () => selectWindow(app.client, 0),
        () => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic', message),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, getMessageScript),
        (result) => assert(result.value, message)
      ];

      return chainPromises(steps);
    });

    it('Subscribing to wildcard topic calls listener', function() {
      const message = 'message';

      const steps = [
        () => openNewWindow(app.client, defaultWindowOptions),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, setupScript, '*', '*'),
        (result) => { secondWindowId = result.value; },
        () => selectWindow(app.client, 0),
        () => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic', message),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, getMessageScript),
        (result) => assert(result.value, message)
      ];

      return chainPromises(steps);
    });

    it('Subscribing to wrong topic does not call listener', function() {
      const message = 'message';

      const steps = [
        () => openNewWindow(app.client, defaultWindowOptions),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, setupScript, '*', 'topic'),
        (result) => { secondWindowId = result.value; },
        () => selectWindow(app.client, 0),
        () => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic2', message),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, getMessageScript),
        (result) => assert(result.value, 'empty')
      ];

      return chainPromises(steps);
    });

    it('Subscribing to wrong window id does not call listener', function() {
      const message = 'message';

      const steps = [
        () => openNewWindow(app.client, defaultWindowOptions),
        () => executeAsyncJavascript(app.client, setupScript, 'wrong', 'topic'),
        (result) => { secondWindowId = result.value; },
        () => selectWindow(app.client, 0),
        () => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic', message),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, getMessageScript),
        (result) => assert(result.value, 'empty')
      ];

      return chainPromises(steps);
    });
  });
});
