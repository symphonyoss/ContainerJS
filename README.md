# ContainerJS
[![Build Status](https://travis-ci.org/symphonyoss/ContainerJS.svg?branch=master)](https://travis-ci.org/symphonyoss/ContainerJS)
[![Build Status](https://ci.appveyor.com/api/projects/status/v5u6x1hv81k4n8v7/branch/master?svg=true)](https://ci.appveyor.com/project/colineberhardt/containerjs)
[![Symphony Software Foundation - Incubating](https://cdn.rawgit.com/symphonyoss/contrib-toolbox/master/images/ssf-badge-incubating.svg)](https://symphonyoss.atlassian.net/wiki/display/FM/Incubating)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/ContainerJS/Lobby)

Pleae visit the [ContainerJS website] for information on getting started, and end-user API documentation.

## Development

This project is a mono-repo, i.e. multiple distinct projects within the same Git repository. This project uses [Lerna](https://github.com/lerna/lerna) to manage the dependencies between these projects and their release process.

To get started, run the following from the project root:

```
npm install
npm run build
```

This will install Lerna and run `lerna bootstrap`, which runs `npm install` on all the sub-projects, and links any cross dependencies.

If you want to see ContainerJS in action, the `api-demo` project has a fully-featured demo that can be run against various containers.

The ContainerJS repo contains the following:

 - `api-specification` - the ContainerJS API specified in TypeScript.
 - `api-browser`, `api-electron`, `api-openfin` - various container-specific implementations of this API.
 - `api-bundle` - a bundle that contains the client-side code for all of the different ContainerJS implementations. This allows exactly the same application code to be run against each container.
 - `api-tests` - a common suite of UI automation tests that exercise the API.
 - `api-demo` - a ContainerJS demo application.
