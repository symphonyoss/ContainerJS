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
  chainPromises
} = require('./test-helpers');

let app;

describe('Notification API', function(done) {
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

  const createNotification = (title, options) => {
    /* eslint-disable no-undef, no-new */
    const script = (title, options, callback) => {
      new Notification(title, options);
      setTimeout(() => callback(), 1000);
    };
    /* eslint-enable no-undef */
    return executeAsyncJavascript(app.client, script, title, options);
  };

  const closeNotification = (handle) => {
    return selectWindow(app.client, handle)
      .then(() => app.client.close());
  };

  describe('New notification', function() {
    it('Should open a notification window', function() {
      const steps = [
        () => createNotification('title', {body: 'body'}),
        () => app.client.getWindowCount(),
        (count) => assert.equal(count, 2),
        () => closeNotification(1)
      ];
      return chainPromises(steps);
    });

    it('Should have correct title', function() {
      const titleTest = 'testtitle';
      const steps = [
        () => createNotification(titleTest, {body: 'body'}),
        () => selectWindow(app.client, 1),
        () => app.client.getText('#title'),
        (text) => assert.equal(text, titleTest),
        () => closeNotification(1)
      ];
      return chainPromises(steps);
    });

    it('Should have correct body', function() {
      const bodyTest = 'testbody';
      const steps = [
        () => createNotification('title', {body: bodyTest}),
        () => selectWindow(app.client, 1),
        () => app.client.getText('#message'),
        (text) => assert.equal(text, bodyTest),
        () => closeNotification(1)
      ];
      return chainPromises(steps);
    });

    it('Should create notification with no body if options omitted', function() {
      const steps = [
        () => createNotification('title'),
        () => selectWindow(app.client, 1),
        () => app.client.getText('#message'),
        (text) => assert.equal(text, ''),
        () => closeNotification(1)
      ];
      return chainPromises(steps);
    });
  });
});
