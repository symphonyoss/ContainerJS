## Overview
The ScreenSnippet API is used to capture a snippet of their desktop (unconstrained by the host application window) and highlight portions of this snippet so it can then be consumed by the host application.

**Currently, the ScreenSnippet API will only capture the `body` element of the current page.**

### Constructor

```javascript
ScreenSnippet()
```
Creates a new instance of the ScreenSnippet class.

### Syntax

```javascript
var mySnippet = new ScreenSnippet();
```

### Parameters
None

### Methods

```javascript
capture()
```
Captures a screen snippet.

### Syntax

```javascript
var mySnippet = new ScreenSnippet();
mySnippet.capture().then(function(dataUri) { ... });
```

### Parameters
None

#### Returns
A Promise that resolves to a base64-encoded PNG [Data URI](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) string with contains the captured image.
