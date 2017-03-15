# Symphony API for Electron

This project provides an implementation of the Symphony Desktop Wrapper API Specification for Electron

## Usage

Add this package to your electron project:

```
npm install ssf-desktop-api-electron --save
```

You need to integrate this code into both your main process and your renderer processes via a preload script.

### Main process integration

This module needs to register IPC handlers once the app `ready` event has fired. This can be done as follows:

```
const ssfElectron = require('ssf-desktop-api-electron');

function createWindow () {
  ssfElectron();
  // ... other stuff!
}

app.on('ready', createWindow)
```

### Renderer process integration

Add the following pre-load script to any browser window that needs to use this API:

```
win = new BrowserWindow({
  // ...
  webPreferences: {
    // ...
    preload: path.join(__dirname, 'node_modules/ssf-desktop-api-electron/preload.js')
  }
})
```
