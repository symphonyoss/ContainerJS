const Application = require('spectron').Application;
const path = require('path');
const electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'ssf-electron');

module.exports = (timeout) => {
  const extension = process.platform === 'win32' ? '.cmd' : '';
  return new Application({
    path: electronPath + extension,
    args: ['-u', 'http://localhost:5000/index.html']
  });
};
