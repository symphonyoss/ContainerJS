const { app } = require('electron');
const ssfElectron = require('ssf-desktop-api-electron');
const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  ssfElectron(url.format({
    pathname: path.join(__dirname, 'src/preload.html'),
    protocol: 'file:',
    slashes: true
  }));
}

app.on('ready', createWindow);

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
