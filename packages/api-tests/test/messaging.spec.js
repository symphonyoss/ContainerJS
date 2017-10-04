const assert = require('assert');
const testContainer = process.env.MOCHA_CONTAINER;
const setup = require(`./${testContainer}-test-setup`);
const {
  initialiseWindows,
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
  const timeout = 90000;
  this.timeout(timeout);

  beforeEach(() => {
    app = setup(timeout);
    return app.start().then(
      () => initialiseWindows(app.client)
    );
  });

  afterEach(() => {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  const subscribeScript = (id, topic, callback) => {
    window.messageServiceFunction = (message) => {
      window.testMessage = message;
    };
    ssf.app.ready().then(() => {
      ssf.MessageService.subscribe(id, topic, window.messageServiceFunction);
      callback(ssf.Window.getCurrentWindow().getId());
    });
  };
  const unsubscribeScript = (id, topic, callback) => {
    ssf.MessageService.unsubscribe(id, topic, window.messageServiceFunction);
    callback();
  };
  const sendMessageScript = (id, topic, message, callback) => {
    ssf.MessageService.send(id, topic, message);
    callback();
  };
  const getMessageScript = (callback) => {
    callback(window.testMessage);
  };

  it('Should have ssf.MessageService available globally', () => {
    const script = (callback) => {
      ssf.app.ready().then(() => {
        if (ssf.MessageService !== undefined) {
          callback();
        }
      });
    };
    return executeAsyncJavascript(app.client, script);
  });

  describe('Send message', () => {
    it('Should send string correctly #ssf.MessageService.send', function() {
      const message = 'message';

      const steps = [
        () => openNewWindow(app.client, defaultWindowOptions),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, subscribeScript, '*', 'topic'),
        (result) => { secondWindowId = result.value; },
        () => selectWindow(app.client, 0),
        () => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic', message),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, getMessageScript),
        (result) => assert.equal(result.value, message)
      ];

      return chainPromises(steps);
    });

    it('Should send javascript object correctly #ssf.MessageService.send', function() {
      const message = {
        a: 1,
        b: '20'
      };

      const steps = [
        () => openNewWindow(app.client, defaultWindowOptions),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, subscribeScript, '*', 'topic'),
        (result) => { secondWindowId = result.value; },
        () => selectWindow(app.client, 0),
        () => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic', message),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, getMessageScript),
        (result) => assert.deepStrictEqual(result.value, message)
      ];

      return chainPromises(steps);
    });

    it('Should send message with windowId to the correct window #ssf.MessageService.send', function() {
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
        () => executeAsyncJavascript(app.client, subscribeScript, '*', 'topic'),
        (result) => { secondWindowId = result.value; },
        () => selectWindow(app.client, 2),
        () => executeAsyncJavascript(app.client, subscribeScript, '*', 'topic'),
        () => selectWindow(app.client, 0),
        () => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic', message),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, getMessageScript),
        (result) => assert.equal(result.value, message),
        () => selectWindow(app.client, 2),
        () => executeAsyncJavascript(app.client, getMessageScript),
        (result) => assert.equal(result.value, undefined)
      ];

      return chainPromises(steps);
    });

    it('Should send message with wildcard to all windows excluding self #ssf.MessageService.send', function() {
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
        () => executeAsyncJavascript(app.client, subscribeScript, '*', 'topic'),
        () => selectWindow(app.client, 2),
        () => executeAsyncJavascript(app.client, subscribeScript, '*', 'topic'),
        () => selectWindow(app.client, 0),
        () => executeAsyncJavascript(app.client, subscribeScript, '*', 'topic'),
        () => executeAsyncJavascript(app.client, sendMessageScript, '*', 'topic', message),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, getMessageScript),
        (result) => assert.equal(result.value, message),
        () => selectWindow(app.client, 2),
        () => executeAsyncJavascript(app.client, getMessageScript),
        (result) => assert.equal(result.value, message),
        () => selectWindow(app.client, 0),
        () => executeAsyncJavascript(app.client, getMessageScript),
        (result) => assert.equal(result.value, undefined)
      ];

      return chainPromises(steps);
    });

    it('Should send message to sibling window #ssf.MessageService.send', function() {
      const message = 'message';

      const thirdWindowOptions = {
        url: 'http://localhost:5000/index.html',
        name: 'messagetest2',
        show: true,
        child: true
      };
      let thirdWindowId;

      const steps = [
        () => openNewWindow(app.client, defaultWindowOptions),
        () => openNewWindow(app.client, thirdWindowOptions),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, subscribeScript, '*', 'topic'),
        () => selectWindow(app.client, 2),
        () => executeAsyncJavascript(app.client, subscribeScript, '*', 'topic'),
        (result) => { thirdWindowId = result.value; },
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, sendMessageScript, thirdWindowId, 'topic', message),
        () => executeAsyncJavascript(app.client, getMessageScript),
        (result) => assert.equal(result.value, undefined),
        () => selectWindow(app.client, 2),
        () => executeAsyncJavascript(app.client, getMessageScript),
        (result) => assert.equal(result.value, message)
      ];

      return chainPromises(steps);
    });
  });

  describe('Receive message', () => {
    it('Should call listener when subscribed to correct topic #ssf.MessageService.subscribe', function() {
      const message = 'message';

      const steps = [
        () => openNewWindow(app.client, defaultWindowOptions),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, subscribeScript, '*', 'topic'),
        (result) => { secondWindowId = result.value; },
        () => selectWindow(app.client, 0),
        () => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic', message),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, getMessageScript),
        (result) => assert.equal(result.value, message)
      ];

      return chainPromises(steps);
    });

    it('Should not call listener when subscribed to wildcard topic #ssf.MessageService.subscribe', function() {
      const message = 'message';

      const steps = [
        () => openNewWindow(app.client, defaultWindowOptions),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, subscribeScript, '*', '*'),
        (result) => { secondWindowId = result.value; },
        () => selectWindow(app.client, 0),
        () => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic', message),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, getMessageScript),
        (result) => assert.equal(result.value, undefined)
      ];

      return chainPromises(steps);
    });

    it('Should not receive message from wrong topic listener #ssf.MessageService.subscribe', function() {
      const message = 'message';

      const steps = [
        () => openNewWindow(app.client, defaultWindowOptions),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, subscribeScript, '*', 'topic'),
        (result) => { secondWindowId = result.value; },
        () => selectWindow(app.client, 0),
        () => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic2', message),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, getMessageScript),
        (result) => assert.equal(result.value, undefined)
      ];

      return chainPromises(steps);
    });

    it('Should not receive message from wrong id #ssf.MessageService.subscribe', function() {
      const message = 'message';

      const steps = [
        () => openNewWindow(app.client, defaultWindowOptions),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, subscribeScript, 'wrong', 'topic'),
        (result) => { secondWindowId = result.value; },
        () => selectWindow(app.client, 0),
        () => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic', message),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, getMessageScript),
        (result) => assert.equal(result.value, undefined)
      ];

      return chainPromises(steps);
    });

    it('Should not receive message after unsubscribe #ssf.MessageService.unsubscribe', function() {
      const message = 'message';

      const steps = [
        () => openNewWindow(app.client, defaultWindowOptions),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, subscribeScript, '*', 'topic'),
        (result) => { secondWindowId = result.value; },
        () => executeAsyncJavascript(app.client, unsubscribeScript, '*', 'topic'),
        () => selectWindow(app.client, 0),
        () => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic', message),
        () => selectWindow(app.client, 1),
        () => executeAsyncJavascript(app.client, getMessageScript),
        (result) => assert.equal(result.value, undefined)
      ];

      return chainPromises(steps);
    });
  });
});
