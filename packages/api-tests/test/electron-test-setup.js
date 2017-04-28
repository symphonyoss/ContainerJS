const Application = require('spectron').Application;
const path = require('path');
const electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');

module.exports = () => {
  const extension = process.platform === 'win32' ? '.cmd' : '';
  return new Application({
    path: electronPath + extension,
    args: [path.join('node_modules', 'containerjs-api-electron', 'main.js')],
    env: {
      TEST: true
    }
  });
};
