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

const defaultWindowOptions = {
  url: 'http://localhost:5000/index.html',
  name: 'messagetest',
  show: true,
  child: true
};

let secondWindowId = '';

if (process.env.MOCHA_CONTAINER !== 'browser') {
  describe('Messaging API', function(done) {
    const timeout = 90000;
    this.timeout(timeout);

    beforeEach(() => {
      app = setup(timeout);

      return app.start();
    });

    afterEach(() => {
      if (app && app.isRunning()) {
        return app.stop();
      }
    });

    /* eslint-disable no-undef */
    const setupScript = (id, topic, callback) => {
      ssf.MessageService.subscribe(id, topic, (message) => {
        window.testMessage = message;
      });
      callback(ssf.Window.getCurrentWindow().getId());
    };
    const sendMessageScript = (id, topic, message, callback) => {
      ssf.MessageService.send(id, topic, message);
      callback();
    };
    const getMessageScript = (callback) => {
      callback(window.testMessage);
    };
    /* eslint-enable no-undef */

    it('Should have ssf.MessageService available globally', () => {
      /* eslint-disable no-undef */
      const script = (callback) => {
        if (ssf.MessageService !== undefined) {
          callback();
        }
      };
      /* eslint-enable no-undef */
      return executeAsyncJavascript(app.client, script);
    });

    describe.only('Send message', () => {
      it('Should send string correctly #ssf.MessageService.send', function() {
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
          () => executeAsyncJavascript(app.client, setupScript, '*', 'topic'),
          (result) => { secondWindowId = result.value; },
          () => selectWindow(app.client, 0),
          () => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic', message),
          () => selectWindow(app.client, 1),
          () => executeAsyncJavascript(app.client, getMessageScript),
          (result) => assert.deepStrictEqual(result.value, message)
        ];

        return chainPromises(steps);
      });

      it('Should send message to the correct window #ssf.MessageService.send', function() {
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
          (result) => assert.equal(result.value, message),
          () => selectWindow(app.client, 2),
          () => executeAsyncJavascript(app.client, getMessageScript),
          (result) => assert.equal(result.value, undefined)
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
          () => executeAsyncJavascript(app.client, setupScript, '*', 'topic'),
          (result) => { secondWindowId = result.value; },
          () => selectWindow(app.client, 0),
          () => executeAsyncJavascript(app.client, sendMessageScript, secondWindowId, 'topic', message),
          () => selectWindow(app.client, 1),
          () => executeAsyncJavascript(app.client, getMessageScript),
          (result) => assert.equal(result.value, message)
        ];

        return chainPromises(steps);
      });

      it.skip('Should not call listener when subscribed to wildcard topic #ssf.MessageService.subscribe', function() {
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
          (result) => assert.equal(result.value, undefined)
        ];

        return chainPromises(steps);
      });

      it.skip('Should not receive message from wrong topic listener #ssf.MessageService.subscribe', function() {
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
          (result) => assert.equal(result.value, undefined)
        ];

        return chainPromises(steps);
      });

      it('Should not receive message from wrong id #ssf.MessageService.subscribe', function() {
        const message = 'message';

        const steps = [
          () => openNewWindow(app.client, defaultWindowOptions),
          () => executeAsyncJavascript(app.client, setupScript, 'wrong', 'topic'),
          (result) => { secondWindowId = result.value; },
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
}
