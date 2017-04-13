const Application = require('spectron').Application;
const path = require('path');
const electronPath = path.join(__dirname, 'node_modules', '.bin', 'electron.cmd');

module.exports = () => {
  return new Application({
    path: electronPath,
    args: [path.join('node_modules', 'ssf-desktop-api-electron', 'main.js')],
    env: {
      TEST: true
    }
  });
};
