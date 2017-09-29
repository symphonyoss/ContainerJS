---
id: cli
layout: default
sectionid: cli
---

## ContainerJS Command Line Interface

ContainerJS has a command line interface for running an application with OpenFin (`ssf-openfin`) or Electron (`ssf-electron`).

#### OpenFin CLI

{% highlight shell_session %}
$ npm install --global containerjs-api-openfin

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
{% endhighlight %}

#### Electron CLI

{% highlight shell_session %}
$ npm install --global containerjs-api-electron

Usage: ssf-electron [options]

  Options:

    -V, --version            output the version number
    -u, --url [url]          Launch url for the application (can be specified in --config instead)
    -c, --config [filename]  (Optional) ContainerJS config file
    -s, --symphony           (Optional) Use Symphony compatibility layer
    -d, --developer          (Optional) Show developer menu
    -h, --help               output usage information
{% endhighlight %}
