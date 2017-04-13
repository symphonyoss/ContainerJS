const containerSetup = require('../test-container-setup.js');
const {
  before,
  after,
  describe,
  it
} = require('mocha');
const liveServer = require('live-server');
const should = require('chai').should();

const params = {
  port: 5000,
  host: '127.0.0.1',
  root: 'src',
  open: false,
  ignore: '*'
};

let app;

describe('Application Startup', function(done) {
  const timeout = 30000;
  this.timeout(timeout);

  before(() => {
    liveServer.start(params);
    app = containerSetup(timeout);

    return app.start();
  });

  after(function() {
    liveServer.shutdown();
    if (app && app.isRunning()) {
      return app.stop().then(done);
    }
    done();
  });

  function executeAsyncJavascript(client, script, resultCallback) {
    client.executeAsync(script).then((result) => {
      resultCallback(undefined, result);
    }, (err) => {
      resultCallback(err, undefined);
    });
  };

  it('Check ssf is available globally', function(done) {
    const script = `
      var callback = arguments[arguments.length - 1];
      if (ssf !== undefined) {
        callback();
      }
    `;
    executeAsyncJavascript(app.client, script, (err, result) => {
      should.not.exist(err);
      done();
    });
  });
});
