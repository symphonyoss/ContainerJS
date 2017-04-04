## Overview

The Window API is used to create a new browser window.

### Constructor
```javascript
new ssf.Window(url, name, features)
```
Creates a new window. If a window with the same name already exists, that window will be reused.  
_Note:_ Window resuse is platform dependant. The API is [inconsistent between browsers](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) and Electron only allows this for windows created via the built in `window.open()` method (child windows), not `new BrowserWindow()` that is used to implement this API.

To get the current window object, use:
```javascript
ssf.Window.getCurrentWindow()
```

### Parameters
**url**  
URL to open in the window. Must be prefixed with the protocol (i.e. http://).

**name**  
Name of the new window. Should not contain whitespace.

**features (optional)**  
Object to set features of the new window.  
* `child: boolean` - make the new window a child of the current window (non browser only).
* `frame: boolean` - create the new window with a frame (non browser only).
* `transparent: boolean` - make the window transparent (non browser only). Clicks are not registered through the transparent window in Electron.

### Return Value
**window**  
A reference to the new window.

### Static Methods
* `getCurrentWindow()`- Get the current window object
* `getCurrentWindowId()` - Get the current window id as a string

### Class Methods
* `addListener(event, callback)` - Add an event listener to execute a given callback
* `blur()` - Remove focus from the window
* `close()` - Close the window
* `focus()` - Give the window focus
* `hide()` - Hide a visible window (Non browser only)
* `removeListener(event, callback)` - Remove an event listener that was previously added
* `removeAllListeners()` - Remove all added listeners
* `show()` - Show a hidden window (Non browser only)

### Events
* **blur** - When the window has lost focus
* **close**- when the window has been closed
* **focus** - When the window has gained focus
* **hide** - When the window is hidden
* **maximize** - When the window is maximized (non browser)
* **minimize** - When the window is minimized (non browser)
* **restore** - When the window is restored from a minimized state (non browser)
* **show** - When the window is shown
