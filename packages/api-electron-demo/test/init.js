var Application = require('spectron').Application;
var should = require('chai').should();
const {
  before,
  after,
  describe,
  it
} = require('mocha');
const path = require('path');
const electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron.cmd');
const liveServer = require('live-server');

const params = {
  port: 5000,
  host: '127.0.0.1',
  root: 'src',
  open: false,
  ignore: '*'
};

liveServer.start(params);

describe('application launch', function() {
  let app;
  let client;
  const timeout = 30000;

  this.timeout(timeout);

  before(function() {
    app = new Application({
      path: electronPath,
      args: [path.join('node_modules', 'ssf-desktop-api-electron', 'main.js')],
      env: {
        TEST: true
      }
    });

    return app.start().then(function() {
      app.isRunning().should.equal(true);
      client = app.client;
      client.timeoutsImplicitWait(timeout);
      client.timeoutsAsyncScript(timeout);
      client.timeouts('page load', timeout);
    }, function(err) {
      console.error(err);
    });
  });

  after(function() {
    liveServer.shutdown();
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  /**
   * Inject a snippet of JavaScript into the page for execution in the context of the currently selected window.
   * The executed script is assumed to be asynchronous and must signal that is done by invoking the provided callback, which is always
   * provided as the final argument to the function. The value to this callback will be returned to the client.
   *
   * @param script
   * @param resultCallback callback with result of the javascript code
   */
  function executeAsyncJavascript(script, resultCallback) {
    client.executeAsync(script).then((result) => {
      resultCallback(undefined, result);
    }, (err) => {
      resultCallback(err, undefined);
    });
  }

  it('Check ssf is available globally', function(done) {
    executeAsyncJavascript('var callback = arguments[arguments.length - 1];' +
      'if (ssf !== undefined) { callback(); }', (err, result) => {
      should.not.exist(err);
      done();
    });
  });
});
