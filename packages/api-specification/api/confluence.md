## [Activate API](https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/Activate+API)

> This api allows a window to be move to the front and given focus.   This API is needed since JS web apps have no capability to perform such a function.  

The API proposal introduces window management section that enables the user to create, discover and manage windows.
It also defines a window object that has a set of properties and methods.

One of these methods is activate that will bring the window to front and focus it:
```javascript
// activate my window
var myWindow = ssf.windows.current;
myWindow.activate();

// activate some other window
var someWindow = ssf.windows.getById('4');
someWindow.activate();
```

## [RegisterBoundsChange API](https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/RegisterBoundsChange+API)
> This API allows JS web app to register a callback that will be notified whenever any child window's size or position changes.  The primary motivation is to support a feature called "saved layout".  This feature allows the symphony web app to save the size and location of child windows and restore them when the app is restarted (or refreshed).

Using the windows API the application can subscribe for
```javascript
ssf.windows.onWindowBoundsChanged(function(window, bounds){
    
})
```

Or it can subscribe for each window individually 
```javascript
someWindow.on('boundsChanged', function(bounds){
    
});
```

Or it can iterate the windows when the layout should be saved
```javascript
ssf.windows.all.forEach(function(window){
    var boundsToSave = window.bounds;    
});
```
## [Activity API](https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/Activity+API)
> The application needs to be informed if activity (keyboard or mouse input) has occurred.

Another section in the proposal is system API that allows the application to access system specific stuff.


```javascript
ssf.system.onUserActivity(function(){
    
}, 1000);
```

## ScreenSnippet API

## getMediaSources API

## BadgeCount API
## Notification API
## Version API