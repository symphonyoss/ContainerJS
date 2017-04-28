const Application = require('spectron').Application;
const spawn = require('child_process').spawn;

module.exports = (timeout) => {
  if (process.platform === 'win32') {
    const args = ['/c', 'openfin -l -c http://localhost:5000/app.json'];
    spawn('cmd.exe', args);
  } else {
    const args = ['-c', 'openfin -l -c http://localhost:5000/app.json'];
    spawn('/bin/bash', args);
  }

  return new Application({
    connectionRetryCount: 1,
    connectionRetryTimeout: timeout,
    startTimeout: timeout,
    waitTimeout: timeout,
    debuggerAddress: '127.0.0.1:9090'
  });
};
