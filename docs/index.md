---
id: home
layout: default
sectionid: home
---

## Project Status

ContainerJS is currently under active development, with frequent breaking changes!

## Getting Started

The following describes how to create a simple 'Hello World' application and run it with Electron, OpenFin and a Browser.

#### Creating the Hello World app

From within an empty folder, add a minimal HTML file called `index.html`:

```html
<!doctype html>
<meta charset="utf-8">
<body>
  <h1>Hello World!</h1>
  <div>
    ContainerJS status: <span id="status">initialising</span>
  </div>

  <script src="https://unpkg.com/containerjs-api-bundle@0.0.2/build/containerjs-bundle.js"></script>

  <script>
    ssf.app.ready()
      .then(() => {
        const status = document.getElementById('status')
        status.innerText = 'ready';
      });
  </script>
</body>
```

The above displays a simple welcome message and indicates the status of the ContaunerJS APIs. The `containerjs-bundle.js` is the client-side bundle that detects the container that the page is running within (e.g. Electron, OpenFin) and provides the required API implementation. In the above code, this bundle is being downloaded from the `unpkg` CDN for simplicity.

This file uses the ssf API to handle the container `ready` promise, updating the status text when this lifecycle event occurs..

Within the same folder, add the following `app.json` manifest file:

```json
{
  "startup_app": {
    "name": "Hello World",
    "url": "http://localhost:8080/index.html",
    "uuid": "hello-world",
    "autoShow": true
  },
  "runtime": {
    "version": "stable"
  }
}
```

The manifest tells the container which URL to load initially.

#### Starting a local server

The container loads HTML applications over HTTP, so in order to run this demo application you need to start a local server. If you don't already have a preferred tool, you can use the node `http-server` package:

```
$ npm install --global http-server
$ http-server -p 8080
```

This starts a server on port 8080.

#### Running with OpenFin

OpenFin has a command line tool for launching OpenFin applications. This can be installed as follows:

```
$ npm install --global openfin-cli
```

To run your simple 'Hello World' application from within an OpenFin container, execute the following:

```
$ openfin --launch --config app.json
```

You should now see the Hello World application, and see the status update to 'ready'

#### Running with Electron

The ContainerJS project provides an Electron-based command line tool, which can be installed as follows:

```
$ npm install --global ssf-electron
```

From within your 'Hello World' folder, execute the following:

```
$ ssf-electron app.json
```

You should now see exactly the same app running within Electron.

#### Browser

To run your app within a browser, simply navigate to the URL `http://localhost:8080/index.html`.
