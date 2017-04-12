var Application = require('spectron').Application;
var assert = require('assert');
const {
  before,
  after,
  describe,
  it
} = require('mocha');
const path = require('path');
const electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron.cmd');

// Start serving files
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
  this.timeout(10000);

  before(function() {
    this.app = new Application({
      path: electronPath,
      args: [path.join('node_modules', 'ssf-desktop-api-electron', 'main.js')],
      env: {
        TEST: true
      }
    });

    return this.app.start();
  });

  after(function() {
    liveServer.shutdown();
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('Check title is correct', function() {
    return this.app.client.getTitle().then(function(title) {
      assert.equal(title, 'Symphony Desktop Wrapper API Specification');
    });
  });
});
