# ContainerJS API for OpenFin

This project provides an implementation of ContainerJS which follows the Symphony Desktop Wrapper API Specification for OpenFin
For more information, see [The ContainerJS website](https://symphonyoss.github.io/ContainerJS/)

## Usage

Add this package to your OpenFin project:

```
npm install containerjs-api-openfin --save
```

### Running the app

Use the `ssf-openfin` binary to run the application. This can be installed globally by doing:

```
npm install --global containerjs-api-electron

Usage: ssf-openfin [options]

  Options:

    -V, --version                    output the version number
    -u, --url [url]                  Launch url for the application (can be specified in --config instead)
    -c, --config [filename]          (Optional) ContainerJS config file
    -s, --symphony                   (Optional) Use Symphony compatibility layer
    -o, --output-config [filename]   (Optional) Where to output the OpenFin config file
    -C, --config-url [url]           (Optional) Url to read the new app.json file from to start OpenFin
    -f, --openfin-version [version]  (Optional) Version of the OpenFin runtime to use, default is stable
    -n, --notification [directory]   (Optional) Generate an example notification file in the specified directory
    -h, --help                       output usage information
```

To run the application, do:

```
ssf-openfin --url http://website/index.html
```

