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
 - `api-tests` - a common suite of UI automation tests that exercise the API.
 - `api-demo` - a ContainerJS demo application.
 - `api-utility` - utility code that is common to the various containers.
 - `api-symphony-compatibility`, `api-symphony-demo` - an alternative ContainerJS API that is being debated via the [Symphony Foundation Desktop Wrapper Working Group](https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/Proposed+Standard+API+Specifications).

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

### Release

To prepare for a release, you will need a fresh clone of the `master` branch of `symphonyoss/ContainerJS`.

The release process itself is handled by [lerna](https://lernajs.io/), using the independent versioning setting.

To build the packages in preparation for release:

```shell-script
npm install
npm run build
```

To actually release the packages to `npm`, you need an npm account that's a collaborator on the containerjs packages, logged into `npm` on the command line:

```shell-script
npm login
```

If you want to test the packages locally, before publishing, you can [npm pack](https://docs.npmjs.com/cli/pack) them, then [npm install](https://docs.npmjs.com/cli/install) into a project from the resulting archive file.

To start the release process, run:

```shell-script
npm run publish
```

and follow the instructions. This will publish each version to `npm`, and then create a commit with the commit message "Publish", tagged with each version that has been published. This commit _needs_ to be pushed directly to `master`, as this combination of commit and tags underpins `lerna`'s release process.

Check that the packages are showing correctly on `npm`, then push this commit and tags:

```shell-script
git push <remote> --tags
```

Note that this is a _direct_ commit to `master`, not a PR. This is necessary for two reasons. Firstly because `lerna` relies on the tags that it generates to be reachable from `master`. As tags are not transferred by a PR, this leaves orphaned tags that cause `lerna` to fail. Secondly, by the time the commit has been made, the packages have already been published to `npm`, so a PR holds no real value, and can actually cause more problems with the release if it isn't merged in a timely manner. `master` is currently protected, so as a workaround it requires temporarily removing the admin restriction on pushing to allow a `git push` of the commit.