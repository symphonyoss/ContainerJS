const { app } = require('electron');
const ssfElectron = require('./index.js');
const fs = require('fs');
const program = require('commander');

program
  .option('-c, --config [filename]', 'ContainerJS config file', 'app.json')
  .option('-s, --symphony', '(Optional) Use Symphony compatibility layer', (v, val) => true, false)
  .option('-d, --developer', '(Optional) Show developer menu', (v, val) => true, false)
  .parse(process.argv);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  // the appJson location is passed to the ssf-electron bin script
  const configLocation = program.config;
  const appJsonPath = process.cwd() + '/' + configLocation;
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

  ssfElectron(appJson, program.symphony, program.developer);
}

ssfElectron.app.ready(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
