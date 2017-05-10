# ContainerJS
[![Build Status](https://travis-ci.org/symphonyoss/containerjs.svg?branch=master)](https://travis-ci.org/symphonyoss/containerjs)
[![Build Status](https://ci.appveyor.com/api/projects/status/v5u6x1hv81k4n8v7/branch/master?svg=true)](https://ci.appveyor.com/project/colineberhardt/containerjs)
[![Symphony Software Foundation - Incubating](https://cdn.rawgit.com/symphonyoss/contrib-toolbox/master/images/ssf-badge-incubating.svg)](https://symphonyoss.atlassian.net/wiki/display/FM/Incubating)

ContainerJS provides an abstraction layer over multiple HTML5 containers (OpenFin, Electron, Browser), that follows the Symphony Desktop APIs. For more details, refer to the [confluence page](https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/Working+Group+-+Desktop+Wrapper+API) for this working group.

## Getting Started

The following describes how to create a simple 'Hello World' application and run it with OpenFin and Electron. The current setup process is not very tidy, expect this to improve over time!

### Creating the Hello World app

The first step is to install all of the dependencies of this project. From the root folder, run the following:

```
npm install
```

Now you can start creating your app. From within an empty folder, add a minimal HTML file called `index.js`:

```html
<!doctype html>
<meta charset="utf-8">
<body>
  <h1>Hello World!</h1>

  <script src="containerjs-api.js"></script>

  <script>
    ssf.app.ready()
      .then(() => {
        new Notification('Hello World');
      });
  </script>
</body>
```

This file uses the ssf API to handle the container `ready` promise, then creates a notification. Notice that it loads the `containerjs-api.js` script, which provides the client-side APIs (within OpenFin).

Within the same folder, add the following `app.json` manifest file:

```json
{
  "startup_app": {
    "name": "Hello World",
    "url": "http://localhost:5000/index.html",
    "uuid": "hello-world",
    "autoShow": true
  },
  "runtime": {
    "version": "stable"
  }
}
```

The manifest tells the container which URL to load initially.

### Starting a local server

The container loads HTML applications over HTTP, so in order to run this demo application you need to start a local server. If you don't already have a preferred tool, you can use the node `http-server` package:

```
npm install --global http-server
http-server -p 5000
```

This starts a server on port 5000.

### Running with OpenFin

First copy the contents of the `packages/api-openfin/dist` folder contents into the folder where your app is located. This provides the client-side API to your app.

Next, install the OpenFin CLI tool:

```
npm install --global openfin-cli
```

Finally, launch the app:

```
openfin --launch --config app.json
```

You should now see the Hello World application!

### Running with Electron

In order to run the same application with Electron, you need to install the CLI tool which is part of this project. From within the `packages/api-electron` folder, run the following:

```
npm install --global --ignore-scripts .
```

This installs the `ssf-electron` command line tool as a global npm package.

You can now launch the app with the following command:

```
ssf-electron app.json
```

You should now see exactly the same app running within Electron.

## Roadmap

For details on the progress and roadmap, see the [wiki pages](https://github.com/symphonyoss/containerjs/wiki)

## Development

This project is a mono-repo, i.e. multiple distinct projects within the same Git repository. This project uses [Lerna](https://github.com/lerna/lerna) to manage the dependencies between these projects and their release process.

To get started, run the following from the project root:

```
npm install
```

This will install Lerna and run `lerna bootstrap`, which runs `npm install` on all the sub-projects, and links any cross dependencies.

To run each project, use
```
npm run browser
npm run electron
npm run openfin
```
or refer to the demo projects
