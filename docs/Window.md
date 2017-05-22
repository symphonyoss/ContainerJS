---  
id: WindowApi
title: Window Api
permalink: docs/Window.html
layout: docs
sectionid: docs
---  

# Window  
#### constructor  ![constructor](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![constructor](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`new Window() => Window`  
**innerWindow**: `any`  
#### addListener  ![addListener](https://img.shields.io/badge/Electron-no_test_data-lightgrey.svg) ![addListener](https://img.shields.io/badge/OpenFin-no_test_data-lightgrey.svg)
`addListener(event: string, listener: Function) => void`  
Adds a listener for a particular window event.  
#### blur  ![blur](https://img.shields.io/badge/Electron-0%2F0-lightgrey.svg) ![blur](https://img.shields.io/badge/OpenFin-0%2F0-lightgrey.svg)
`blur() => <void>`  
Removes focus from the window.  
**Returns:** `<void>` - A promise which resolves to nothing when the function has completed.
  
#### close  ![close](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![close](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`close() => <void>`  
Closes the window.  
**Returns:** `<void>` - A promise which resolves to nothing when the function has completed.
  
#### flashFrame  ![flashFrame](https://img.shields.io/badge/Electron-0%2F0-lightgrey.svg) ![flashFrame](https://img.shields.io/badge/OpenFin-0%2F0-lightgrey.svg)
`flashFrame(flag: boolean) => <void>`  
Flashes the window's frame and taskbar icon.  
**Returns:** `<void>` - A promise which resolves to nothing when the function has completed.
  
#### focus  ![focus](https://img.shields.io/badge/Electron-0%2F0-lightgrey.svg) ![focus](https://img.shields.io/badge/OpenFin-0%2F0-lightgrey.svg)
`focus() => <void>`  
Focuses the window.  
**Returns:** `<void>` - A promise which resolves to nothing when the function has completed.
  
#### getBounds  ![getBounds](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![getBounds](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`getBounds() => <Rectangle>`  
Returns the bounds of the window.  
**Returns:** `<Rectangle>` - A promise that resolves to an object specifying the bounds of the window.
  
#### getChildWindows  ![getChildWindows](https://img.shields.io/badge/Electron-2%2F2-brightgreen.svg) ![getChildWindows](https://img.shields.io/badge/OpenFin-2%2F2-brightgreen.svg)
`getChildWindows() => <any>`  
Get the child windows of the window.  
**Returns:** `<any>` - A promise that resolves to an array of child windows.
  
#### getMaximumSize  ![getMaximumSize](https://img.shields.io/badge/Electron-2%2F2-brightgreen.svg) ![getMaximumSize](https://img.shields.io/badge/OpenFin-2%2F2-brightgreen.svg)
`getMaximumSize() => <<number>>`  
Get the maximum size of the window.  
**Returns:** `<<number>>` - A promise that resolves to an array containing the maximum width and height of the window.
  
#### getMinimumSize  ![getMinimumSize](https://img.shields.io/badge/Electron-2%2F2-brightgreen.svg) ![getMinimumSize](https://img.shields.io/badge/OpenFin-2%2F2-brightgreen.svg)
`getMinimumSize() => <<number>>`  
Get the minimum size of the window.  
**Returns:** `<<number>>` - A promise that resolves to an array containing the minimum width and height of the window.
  
#### getParentWindow  ![getParentWindow](https://img.shields.io/badge/Electron-2%2F2-brightgreen.svg) ![getParentWindow](https://img.shields.io/badge/OpenFin-2%2F2-brightgreen.svg)
`getParentWindow() => <any>`  
Get the parent of the window. Null will be returned if the window has no parent.  
**Returns:** `<any>` - The parent window.
  
#### getPosition  ![getPosition](https://img.shields.io/badge/Electron-2%2F2-brightgreen.svg) ![getPosition](https://img.shields.io/badge/OpenFin-2%2F2-brightgreen.svg)
`getPosition() => <<number>>`  
Get the position of the window.  
**Returns:** `<<number>>` - A promise that resolves to an array of integers containing the x and y coordinates of the window.
  
#### getSize  ![getSize](https://img.shields.io/badge/Electron-2%2F2-brightgreen.svg) ![getSize](https://img.shields.io/badge/OpenFin-2%2F2-brightgreen.svg)
`getSize() => <<number>>`  
Get the width and height of the window.  
**Returns:** `<<number>>` - A promise that resolves to an array of integers containing the width and height of the window.
  
#### getTitle  ![getTitle](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![getTitle](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`getTitle() => <string>`  
Get the title of the window  
**Returns:** `<string>` - The title of the window.
  
#### hasShadow  ![hasShadow](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![hasShadow](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`hasShadow() => <boolean>`  
Check if the window has a shadow.  
**Returns:** `<boolean>` - A promise that resolves to a boolean stating if the window has a shadow.
  
#### hide  ![hide](https://img.shields.io/badge/Electron-0%2F0-lightgrey.svg) ![hide](https://img.shields.io/badge/OpenFin-0%2F0-lightgrey.svg)
`hide() => <void>`  
Hides the window.  
**Returns:** `<void>` - A promise that resolves to nothing when the window has hidden.
  
#### isAlwaysOnTop  ![isAlwaysOnTop](https://img.shields.io/badge/Electron-no_test_data-lightgrey.svg) ![isAlwaysOnTop](https://img.shields.io/badge/OpenFin-no_test_data-lightgrey.svg)
`isAlwaysOnTop() => <boolean>`  
Check if the window is always on top of all other windows.  
**Returns:** `<boolean>` - A promise that resolves to a boolean stating if the window is always on top.
  
#### isMaximizable  ![isMaximizable](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![isMaximizable](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`isMaximizable() => <boolean>`  
Check if the window can be maximized.  
**Returns:** `<boolean>` - A promise that resolves to a boolean stating if the window can be maximized.
  
#### isMaximized  ![isMaximized](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![isMaximized](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`isMaximized() => <boolean>`  
Check if the window is currently maximized.  
**Returns:** `<boolean>` - A promise that resolves to a boolean stating if the window is maximized.
  
#### isMinimizable  ![isMinimizable](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![isMinimizable](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`isMinimizable() => <boolean>`  
Check if the window can be minimized.  
**Returns:** `<boolean>` - A promise that resolves to a boolean stating if the window can be minimized.
  
#### isMinimized  ![isMinimized](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![isMinimized](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`isMinimized() => <boolean>`  
Check if the window is currently minimized.  
**Returns:** `<boolean>` - A promise that resolves to a boolean stating if the window is minimized.
  
#### isResizable  ![isResizable](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![isResizable](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`isResizable() => <boolean>`  
Check if the window can be resized.  
**Returns:** `<boolean>` - A promise that resolves to a boolean stating if the window can be resized.
  
#### loadURL  ![loadURL](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![loadURL](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`loadURL(url: string) => <void>`  
Load a new URL in the window.  
**Returns:** `<void>` - A promise that resolves when the window method succeeds.
  
#### maximize  ![maximize](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![maximize](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`maximize() => <void>`  
Maximize the window.  
**Returns:** `<void>` - A promise that resolves to nothing when the window has maximized.
  
#### minimize  ![minimize](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![minimize](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`minimize() => <void>`  
Minimize the window.  
**Returns:** `<void>` - A promise that resolves to nothing when the window has minimized.
  
#### postMessage  ![postMessage](https://img.shields.io/badge/Electron-no_test_data-lightgrey.svg) ![postMessage](https://img.shields.io/badge/OpenFin-no_test_data-lightgrey.svg)
`postMessage(message: string|Object) => void`  
Send a message to the window.  
#### reload  ![reload](https://img.shields.io/badge/Electron-0%2F0-lightgrey.svg) ![reload](https://img.shields.io/badge/OpenFin-0%2F0-lightgrey.svg)
`reload() => <void>`  
Reload the window.  
**Returns:** `<void>` - A promise that resolves when the window method succeeds.
  
#### removeAllListeners  ![removeAllListeners](https://img.shields.io/badge/Electron-no_test_data-lightgrey.svg) ![removeAllListeners](https://img.shields.io/badge/OpenFin-no_test_data-lightgrey.svg)
`removeAllListeners() => void`  
Removes all listeners from all window events.  
#### removeListener  ![removeListener](https://img.shields.io/badge/Electron-no_test_data-lightgrey.svg) ![removeListener](https://img.shields.io/badge/OpenFin-no_test_data-lightgrey.svg)
`removeListener(event: string, listener: Function) => void`  
Removes an event listener from the window. The listener must be the same function that was passed into addListener.  
#### restore  ![restore](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![restore](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`restore() => <void>`  
Restores the window to the previous state.  
**Returns:** `<void>` - A promise that resolves to nothing when the window method succeeds.
  
#### setAlwaysOnTop  ![setAlwaysOnTop](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![setAlwaysOnTop](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`setAlwaysOnTop(alwaysOnTop: boolean) => <void>`  
Sets the window to always be on top of other windows.  
**Returns:** `<void>` - A promise that resolves to nothing when the option is set.
  
#### setBounds  ![setBounds](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![setBounds](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`setBounds(bounds: Rectangle) => <void>`  
Sets the window to always be on top of other windows.  
**Returns:** `<void>` - A promise that resolves to nothing when the option is set.
  
#### setIcon  ![setIcon](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![setIcon](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`setIcon(icon: string) => <void>`  
Sets the window icon.  
**Returns:** `<void>` - A promise that resolves to nothing when the option has been set.
  
#### setMaximizable  ![setMaximizable](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![setMaximizable](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`setMaximizable(maximizable: boolean) => <void>`  
Sets if the window can be maximized.  
**Returns:** `<void>` - A promise that resolves to nothing when the option has been set.
  
#### setMaximumSize  ![setMaximumSize](https://img.shields.io/badge/Electron-2%2F2-brightgreen.svg) ![setMaximumSize](https://img.shields.io/badge/OpenFin-2%2F2-brightgreen.svg)
`setMaximumSize(maxWidth: number, maxHeight: number) => <void>`  
Sets the windows maximum size.  
**Returns:** `<void>` - A promise that resolves to nothing when the option has been set.
  
#### setMinimizable  ![setMinimizable](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![setMinimizable](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`setMinimizable(minimizable: boolean) => <void>`  
Sets if the window can be minimized.  
**Returns:** `<void>` - A promise that resolves to nothing when the option has been set.
  
#### setMinimumSize  ![setMinimumSize](https://img.shields.io/badge/Electron-2%2F2-brightgreen.svg) ![setMinimumSize](https://img.shields.io/badge/OpenFin-2%2F2-brightgreen.svg)
`setMinimumSize(minWidth: number, minHeight: number) => <void>`  
Sets the windows minimum size.  
**Returns:** `<void>` - A promise that resolves to nothing when the option has been set.
  
#### setPosition  ![setPosition](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![setPosition](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`setPosition(x: number, y: number) => <void>`  
Sets the windows position.  
**Returns:** `<void>` - A promise that resolves to nothing when the option has been set.
  
#### setResizable  ![setResizable](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![setResizable](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`setResizable(resizable: boolean) => <void>`  
Sets if the window is resizable.  
**Returns:** `<void>` - A promise that resolves to nothing when the option has been set.
  
#### setSize  ![setSize](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![setSize](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`setSize(width: number, height: number) => <void>`  
Sets the width and height of the window.  
**Returns:** `<void>` - A promise that resolves to nothing when the option has been set.
  
#### setSkipTaskbar  ![setSkipTaskbar](https://img.shields.io/badge/Electron-0%2F0-lightgrey.svg) ![setSkipTaskbar](https://img.shields.io/badge/OpenFin-0%2F0-lightgrey.svg)
`setSkipTaskbar(skipTaskbar: boolean) => <void>`  
Sets if the window is shown in the taskbar.  
**Returns:** `<void>` - A promise that resolves to nothing when the option has been set.
  
#### show  ![show](https://img.shields.io/badge/Electron-0%2F0-lightgrey.svg) ![show](https://img.shields.io/badge/OpenFin-0%2F0-lightgrey.svg)
`show() => <void>`  
Show the window.  
**Returns:** `<void>` - A promise that resolves to nothing when the window is showing.
  
#### unmaximize  ![unmaximize](https://img.shields.io/badge/Electron-1%2F1-brightgreen.svg) ![unmaximize](https://img.shields.io/badge/OpenFin-1%2F1-brightgreen.svg)
`unmaximize() => <void>`  
Unmaximize the window.  
**Returns:** `<void>` - A promise that resolves to nothing when the window has unmaximized.
  
#### getCurrentWindow (static)  ![getCurrentWindow](https://img.shields.io/badge/Electron-no_test_data-lightgrey.svg) ![getCurrentWindow](https://img.shields.io/badge/OpenFin-no_test_data-lightgrey.svg)
`getCurrentWindow(callback: Function, errorCallback: Function) => Window`  
Gets the current window object.  
**Returns:** `Window` - The window.  
#### getCurrentWindowId (static)  ![getCurrentWindowId](https://img.shields.io/badge/Electron-no_test_data-lightgrey.svg) ![getCurrentWindowId](https://img.shields.io/badge/OpenFin-no_test_data-lightgrey.svg)
`getCurrentWindowId() => string`  
Gets the id of the current window.  
**Returns:** `string` - The window id.  
