---
id: manifest
layout: default
sectionid: manifest
---

## Application Manifest

The ssf-openfin and ssf-electron [Command Line Interface](cli) tools can customise the
initial application window using an application manifest file.

#### Simple manifest file

Within the same folder as your website, add the following `app.json` manifest file:

```{% highlight json %}```
{
  "url": "http://localhost:8080/index.html",
  "defaultWidth": 600,
  "defaultHeight": 600
}
{% endhighlight %}

The manifest tells the container which URL to load initially, and specifies the initial window size.

#### Manifest options

The following manifest options are supported for both Electron and Openfin

{% highlight javascript %}
{
  "url": "http://localhost:8080/index.html",  // Initial application URL
  "autoShow": true,                           // Whether to show the main window automatically
  "defaultWidth": 600,                        // Default window width
  "defaultHeight": 600,                       // Default window height
  "minWidth": 100,                            // Minimum window width
  "minHeight": 100,                           // Minimum window height
  "maxWidth": 1000,                           // Maximum window width
  "maxHeight": 800,                           // Maximum window height
}
{% endhighlight %}

In addition to the above settings, OpenFin also supports all options from the `startup_app`
section of the OpenFin [Application Config](https://openfin.co/application-config/) file.
