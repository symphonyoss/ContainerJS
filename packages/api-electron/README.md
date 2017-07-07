# ContainerJS API for Electron

This project provides an implementation of ContainerJS which follows the Symphony Desktop Wrapper API Specification for Electron.
For more information, see [The ContainerJS website](https://symphonyoss.github.io/ContainerJS/)

## Usage

Add this package to your electron project:

```
npm install containerjs-api-electron --save
```

You need to integrate this code into both your main process and your renderer processes via a preload script.

### Main process integration

This module needs to register IPC handlers once the app `ready` event has fired. This can be done as follows:

```
const ssfElectron = require('containerjs-api-electron');

function createWindow () {
  ssfElectron(url);
  // ... other stuff!
}

app.on('ready', createWindow)
```

where `url` is the URL to load in the hidden window.

### Renderer process integration

The call to ssfElectron will create a browser window and will load the URL passed in the `app.json` file. From here, use `new ssf.Window()` to create windows.

### Running the app

Use the `ssf-electron` binary to run the application. This can be installed globally by doing:

```
npm install --global containerjs-api-electron
```

To run the application, do:

```
ssf-electron ./path/to/app.json
```
