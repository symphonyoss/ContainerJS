---
id: windowApi
title: Window Api
permalink: docs/window.html
layout: docs
sectionid: docs
---

## Overview

The Window API is used to create a new browser window. Compatability between supported options and methods can be found [here](https://github.com/symphonyoss/ContainerJS/docs/window).

### Constructor
```javascript
new ssf.Window([features, callback, errorCallback])
```
Creates a new window. If a window with the same name already exists, that window will be reused.  
_Note:_ Window resuse is platform dependant. The API is [inconsistent between browsers](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) and Electron only allows this for windows created via the built in `window.open()` method (child windows), not `new BrowserWindow()` that is used to implement this API.

To get the current window object, use:
```javascript
ssf.Window.getCurrentWindow()
```

### Parameters

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

**callback (optional)**
Function to be ran once the window has been created successfully. In Electron and browser, this is called after the new window has been created. In OpenFin this is used as the `successCallback`;

**errorCallback (optional)**
Function to be ran if the Window creation fails (eg. a window with the same name already exists). This is not implemented in Electron and browser. In OpenFin this is used as the `errorCallback`;

### Return Value
**window**  
A reference to the new window.

### Static Methods
* `getCurrentWindow()`- Get the current window object

### Class Methods
_All methods return a promise that resolves to nothing, unless stated otherwise_
* `addListener(event, callback)` - Add an event listener to execute a given callback
* `blur()` - Remove focus from the window.
* `close()` - Close the window.
* `flashFrame(flag)` - Flashes the window’s frame and taskbar icon.
* `focus()` - Give the window focus.
* `getChildWindows()` - Returns an array of the current child windows (including closed windows)
* `getBounds()` - Gets the current bounds ({x, y, width, height}) of the window.
* `getId()` - Gets the id of the window.
* `getMaximumSize()` - Returns `Integer[width, height]` - Contains the window’s maximum width and height.
* `getMinimumSize()` - Returns `Integer[width, height]` - Contains the window’s minimum width and height.
* `getParentWindow()` - Returns the parent window.
* `getPosition()` - Returns `Integer[x, y]` - Contains the window’s current position.
* `getSize()` - Returns `Integer[width, height]` - Contains the window’s width and height.
* `getTitle()` - Returns `String` - The title of the native window.
* `hasShadow()` - Returns `Boolean` - Whether the window has a shadow.
* `hide()` - Hide a visible window (Non browser only).
* `isAlwaysOnTop()` - Returns `Boolean` - Whether the window is always on top of other windows.
* `isMaximizable()` - Returns `Boolean` - Whether the window can be manually maximized by user.
* `isMaximized()` - Returns `Boolean` - Whether the window is maximized.
* `isMinimizable()` - Returns `Boolean` - Whether the window can be manually minimized by user.
* `isMinimized()` - Returns `Boolean` - Whether the window is minimized.
* `isResizable()` - Returns `Boolean` - Whether the window can be manually resized by user.
* `isVisible()` - Returns `Boolean` - Whether the window is visible.
* `loadURL(url)` - Loads the specified URL.
* `maximize()` - Maximizes the window.
* `minimize()` - Minimizes the window.
* `postMessage(message)` - Sends a message to the window. `message` can be any serializable object
* `reload()` - Reloads the window.
* `removeListener(event, callback)` - Remove an event listener that was previously added
* `removeAllListeners()` - Remove all added listeners
* `restore()` - Restores the window to its previous state.
* `show()` - Show a hidden window (Non browser only).
* `setAlwaysOnTop(flag)` - Sets whether the window should show always on top of other windows.
* `setBounds(bounds)` - Resizes and moves the window to the supplied bounds.
* `setIcon(iconURL)` - Changes window icon.
* `setMaximizable(flag)` - Sets whether the window can be manually maximized by user.
* `setMaximumSize(maxWidth, maxHeight)` - Sets the maximum size of window to width and height.
* `setMinimizable(flag)` - Sets whether the window can be manually minimized by user.
* `setMinimumSize(minWidth, minHeight)` - Sets the minimum size of window to width and height.
* `setPosition(x, y)` - Moves window to `x` and `y`.
* `setResizable(flag)` - Sets whether the window can be manually resized by user.
* `setSize(width, height)` - Resizes the window to `width` and `height`.
* `setSkipTaskbar(flag)` - Sets whether the window shows in the taskbar.
* `unmaximize()` - Unmaximizes the window.

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
