const Application = require('spectron').Application;
const path = require('path');
const spawn = require('child_process').spawn;

module.exports = (timeout) => {
  const openfinPath = path.join(__dirname, '..', 'node_modules', '.bin', 'ssf-openfin');
  const commandLine = `${openfinPath} -u http://localhost:5000/index.html -o ./src/openfinapp.json -f 6.49.20.22 -C http://localhost:5000/openfinapp.json`;

  if (process.platform === 'win32') {
    spawn('cmd.exe', ['/c', commandLine]);
  } else {
    spawn('/bin/bash', ['-c', commandLine]);
  }

  return new Application({
    connectionRetryCount: 1,
    connectionRetryTimeout: timeout,
    startTimeout: timeout,
    waitTimeout: timeout,
    debuggerAddress: '127.0.0.1:9090'
  });
};
