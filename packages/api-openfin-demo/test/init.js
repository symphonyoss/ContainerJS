const Application = require('spectron').Application;
const should = require('chai').should();
const {
  before,
  after,
  describe,
  it
} = require('mocha');
const spawn = require('child_process').spawn;
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

  before(() => {
    if (process.platform === 'win32') {
      const args = ['/c', 'openfin -l -c http://localhost:5000/app.json'];
      spawn('cmd.exe', args);
    } else {
      const args = ['-c', 'openfin -l -c http://localhost:5000/app.json'];
      spawn('/bin/bash', args);
    }

    app = new Application({
      connectionRetryCount: 1,
      connectionRetryTimeout: timeout,
      startTimeout: timeout,
      waitTimeout: timeout,
      debuggerAddress: '127.0.0.1:9090'
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

  it('Check title is correct', function(done) {
    executeAsyncJavascript('var callback = arguments[arguments.length - 1];' +
      'fin.desktop.Window.getCurrent().getInfo(function(v) { callback(v); } );', (err, result) => {
      should.not.exist(err);
      should.exist(result.value.title);
      result.value.title.should.equal('Symphony Desktop Wrapper API Specification');
      done();
    });
  });
});
