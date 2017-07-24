# ContainerJS
[![Build Status](https://travis-ci.org/symphonyoss/ContainerJS.svg?branch=master)](https://travis-ci.org/symphonyoss/ContainerJS)
[![Build Status](https://ci.appveyor.com/api/projects/status/v5u6x1hv81k4n8v7/branch/master?svg=true)](https://ci.appveyor.com/project/colineberhardt/containerjs)
[![Symphony Software Foundation - Incubating](https://cdn.rawgit.com/symphonyoss/contrib-toolbox/master/images/ssf-badge-incubating.svg)](https://symphonyoss.atlassian.net/wiki/display/FM/Incubating)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/ContainerJS/Lobby)

Please visit the [ContainerJS website](https://symphonyoss.github.io/ContainerJS/) for information on getting started, and end-user API documentation.

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

## Website Development

The website can be found in the `docs` folder. It is a Jekyll site, which is hosted via GitHub. The API documentation is generated from the TypeScript interfaces within the `api-specification` package. To run this build execute the following:

```
npm run docs
```

### Tests in Documentation

The documentation also contains the results of the last test runs. To include the test output in the docs:

Within the `api-test` package,
```
npm run test:ci
```

this will run the tests for the `browser`, `electron`, and `OpenFin`, and put the results into the `api-tests\coverage` folder.

Next run
```
npm run report
```

This will generate the test files into the `api-specification` package. Now the test results will be built into the documentation with:

```
npm run docs
```

inside the `api-specification` package.