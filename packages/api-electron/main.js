const { app } = require('electron');
const ssfElectron = require('./index.js');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  // the appJson location is passed to the ssf-electron bin script
  const configLocation = process.env.TEST ? 'src/app.json' : process.argv[5];
  const appJsonPath = process.cwd() + '/' + configLocation;
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

  ssfElectron(appJson);
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
