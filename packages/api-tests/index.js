const windowTests = require('./test/window.spec');
const liveServer = require('live-server');

module.exports = (setup, mocha) => {
  const params = {
    port: 5000,
    host: '127.0.0.1',
    root: 'src',
    open: false,
    ignore: '*'
  };

  mocha.before(() => {
    liveServer.start(params);
  });

  mocha.after(() => {
    liveServer.shutdown();
  });

  mocha.describe('ContainerJS API', function() {
    windowTests(setup, mocha);
  });
};
