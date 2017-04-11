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
Object to set features of the new window (non browser only).  
* `alwaysOnTop: Boolean` - whether the window is always on top of other windows.
* `backgroundColor: String` - set the backgroundColor of the window before the page loads.
* `child: Boolean` - make the new window a child of the current window.
* `center: Boolean` - position the new window in the center of the main screen. (only works on new windows with new ids)
* `frame: Boolean` - create the new window with a frame.
* `hasShadow: Boolean` - show shadows for frameless windows.
* `height: Integer` - window's height in pixels.
* `maxHeight: number` - sets the maximum height of the window.
* `maximizable: Boolean` - whether the window can be maximized.
* `maxWidth: Integer` - sets the maximum width of the window.
* `minHeight: Integer` - sets the minimum height of the window.
* `minimizable: Boolean` - whether the window can be minimized.
* `minWidth: Integer` - sets the minimum width of the window.
* `resizable: Boolean` - whether the window is resizable.
* `show: Boolean` - whether the window should be shown when created.
* `skipTaskbar: Boolean` - whether to show the window in taskbar.
* `transparent: Boolean` - make the window transparent. Clicks are not registered through the transparent window in Electron.
* `width: Integer` - window's width in pixels.
* `x: Integer` - window's left offset.
* `y: Integer` - window's top offset.

### Return Value
**window**  
A reference to the new window.

### Static Methods
* `getCurrentWindow()`- Get the current window object
* `getCurrentWindowId()` - Get the current window id as a string

### Class Methods
* `addListener(event, callback)` - Add an event listener to execute a given callback
* `blur()` - Remove focus from the window. Returns a promise that resolves to nothing
* `close()` - Close the window. Returns a promise that resolves to nothing
* `focus()` - Give the window focus. Returns a promise that resolves to nothing
* `getChildWindows()` - Returns an array of the current child windows (including closed windows)
* `hide()` - Hide a visible window (Non browser only). Returns a promise that resolves to nothing
* `postMessage(message)` - Sends a message to the window. `message` can be any serializable object
* `removeListener(event, callback)` - Remove an event listener that was previously added
* `removeAllListeners()` - Remove all added listeners
* `show()` - Show a hidden window (Non browser only). Returns a promise that resolves to nothing

### Events
* **blur** - When the window has lost focus  
 _No arguments are passed to the listener_
* **close**- When the window has been closed  
_No arguments are passed to the listener_
* **focus** - When the window has gained focus  
_No arguments are passed to the listener_
* **hide** - When the window is hidden  
_No arguments are passed to the listener_
* **maximize** - When the window is maximized (non browser)  
_No arguments are passed to the listener_
* **message** - When the window receives a message from another window  
Listener arguments:
  * `message` - The message that was sent
  * `senderId` - The id of the sending window
* **minimize** - When the window is minimized (non browser)  
_No arguments are passed to the listener_
* **restore** - When the window is restored from a minimized state (non browser)  
_No arguments are passed to the listener_
* **show** - When the window is shown  
_No arguments are passed to the listener_
