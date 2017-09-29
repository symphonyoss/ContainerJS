# ContainerJS API for Electron

This project provides an implementation of ContainerJS which follows the Symphony Desktop Wrapper API Specification for Electron
For more information, see [The ContainerJS website](https://symphonyoss.github.io/ContainerJS/)

## Usage

Add this package to your Electron project:

```
npm install containerjs-api-electron --save
```

### Running the app

Use the `ssf-electron` binary to run the application. This can be installed globally by doing:

```
npm install --global containerjs-api-electron

Usage: ssf-electron [options]

  Options:

    -V, --version            output the version number
    -u, --url [url]          Launch url for the application (can be specified in --config instead)
    -c, --config [filename]  (Optional) ContainerJS config file
    -s, --symphony           (Optional) Use Symphony compatibility layer
    -d, --developer          (Optional) Show developer menu
    -h, --help               output usage information
```

To run the application, do:

```
ssf-electron --url http://website/index.html
```

