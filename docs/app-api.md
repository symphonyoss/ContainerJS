---
id: appApi
title: App Api
permalink: docs/app.html
layout: docs
sectionid: docs
---

## Overview
The App API provides information and control for the application's lifecycle.

### Methods
The `app` object exposes the following methods.</p>

```javascript
ready()
```

### Electron <small>Main process</small>
Calls the provided the callback when the SSF desktop wrapper has completed initialization and is ready to use.

#### Syntax

```javascript
const ssf = require('ssf-desktop-api-electron');
ssf.app.ready(() => { ... });
```

#### Parameters
**callback**  
Called when the SSF desktop wrapper has completed initialization and is ready to use.

#### Returns
`undefined`

### Browser, Electron <small>Renderer process</small> and OpenFin
A promise which resolves when the SSF desktop wrapper has completed initializing and is ready to use.

#### Syntax
```javascript
ssf.app.ready().then(() => { ... });
```

#### Parameters
None

#### Returns
A promise which resolves when the SSF desktop wrapper has completed initializing.
