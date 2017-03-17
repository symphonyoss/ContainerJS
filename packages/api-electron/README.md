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
  ssfElectron(url);
  // ... other stuff!
}

app.on('ready', createWindow)
```

where `url` is the URL to load in the hidden window.

### Renderer process integration

The call to ssfElectron will create a browser window that will not be shown, and will load the URL passed into `ssfElectron()`. From here, use `new ssf.Window()` to create windows.
