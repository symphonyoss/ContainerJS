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
  selectWindow
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
    it('Check notification constructor opens a notification window', function() {
      return createNotification('title', {body: 'body'})
        .then(result => app.client.getWindowCount())
        .then(count => assert.equal(count, 2))
        .then(() => closeNotification(1));
    });

    it('Check notification has correct title', function() {
      const titleTest = 'testtitle';
      return createNotification(titleTest, {body: 'body'})
        .then(() => selectWindow(app.client, 1))
        .then(() => app.client.getText('#title'))
        .then((text) => assert.equal(text, titleTest))
        .then(() => closeNotification(1));
    });

    it('Check notification has correct body', function() {
      const bodyTest = 'testbody';
      return createNotification('title', {body: bodyTest})
        .then(() => selectWindow(app.client, 1))
        .then(() => app.client.getText('#message'))
        .then((text) => assert.equal(text, bodyTest))
        .then(() => closeNotification(1));
    });

    it('Check passing no body text creates notification with no body', function() {
      return createNotification('title')
        .then(() => selectWindow(app.client, 1))
        .then(() => app.client.getText('#message'))
        .then((text) => assert.equal(text, ''))
        .then(() => closeNotification(1));
    });
  });
});
