# Symphony Desktop Wrapper

This project contains the current work-in-progress Symphony Desktop Wrapper. The goal of this project is to provide a common API across multiple HTML5 containers. For more details, refer to the [confluence page](https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/Working+Group+-+Desktop+Wrapper+API) for this working group.

## Roadmap

For details on the progress and roadmap, see the [wiki pages](https://github.com/ScottLogic/ssf-desktop-wrapper/wiki)

## Development

This project is a mono-repo, i.e. multiple distinct projects within the same Git repository. This project uses [Lerna](https://github.com/lerna/lerna) to manage the dependencies between these projects and their release process.

To get started, run the following from the project root:

```
npm install
```

This will install Lerna and run `lerna bootstrap`, which runs `npm install` on all the sub-projects, and links any cross dependencies.

For details on how to run each sub-project, refer to their README file.
