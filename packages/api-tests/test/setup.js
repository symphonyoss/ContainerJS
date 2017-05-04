const liveServer = require('live-server');
const {
  before,
  after
} = require('mocha');

const params = {
  port: 5000,
  host: '127.0.0.1',
  root: 'src',
  open: false,
  ignore: '*',
  logLevel: 0
};

before(() => {
  liveServer.start(params);
});

after(() => {
  liveServer.shutdown();
});
