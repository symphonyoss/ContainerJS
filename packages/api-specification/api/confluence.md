## [Activate API](https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/Activate+API)

> This api allows a window to be move to the front and given focus.   This API is needed since JS web apps have no capability to perform such a function.  
> An example use case might be: the main window might be minimized (or otherwise hidden) and the notification shows that the user then clicks on.  The web app needs to ability to bring the window to the foreground and give focus.  

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

or subscribe for each window individually 
```javascript
someWindow.on('boundsChanged', function(bounds){
    
});
```

or iterate the windows when the layout should be saved
```javascript
ssf.windows.all.forEach(function(window){
    var boundsToSave = window.getBounds(); 
});
```
## [Activity API](https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/Activity+API)
> The application needs to be informed if activity (keyboard or mouse input) has occurred.

Another section in the proposal is system API that allows the application to access system specific stuff.

The application can subscribe for user activity events:
```javascript
ssf.system.onUserActivity(function(){
    
}, 1000);
```

## [getMediaSources API](https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/getMediaSources+API) and [ScreenSnippet API](https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/ScreenSnippet+API)
> In order to support screen sharing the client api needs enumerate screens and windows. 
> This api provided a list of screens (each monitor) and list of windows available; providing title, id and thumbnail.  This api is essentially equivalent of electron api: https://electron.atom.io/docs/api/desktop-capturer/#desktopcapturergetsourcesoptions-callback

> The ScreenSnippet API is used to capture a snippet of their desktop (unconstrained by the host application window) and highlight portions of this snippet so it can then be consumed by the host application.  This functionality is similar to the Windows Screen Snippet tool when used in rectangle capture mode.  This lets a user captures portions of the Windows Desktop, highlight aspects of the image and then save this image for sharing.
Using the system API the user can enumerate the displays and capture any of them
```javascript
// capture all screens
ssf.system.capture().then(function(image){
    
});

// capture each screen as separate image
ssf.system.captureAllDisplays().then(function(images) {
  
});

// capture specific display only
ssf.system.displays[0].capture();

// Capture all windows as separate images with custom size
ssf.system.captureAllWindows({imageSize: {width: 100, height: 100}})
    .then(function(images){
        
    });

// Capture specific window (this goes throught the window API)
var window = ssf.windows.current;
window.capture();
```

## [BadgeCount API](https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/BadgeCount+API)
> Display a number on the application icon in the desktop tray... usually to indicate number of unread messages for given application.

There is application section that provides information about application config and allows 
interactions with app specific functionalities like badgeCounts

```javascript
ssf.application.setBadgeCount(11);
```
## [Notification API](https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/Notification+API)
>The Notifications API is used to configure and display desktop notifications to the user. It is exposed as an extension to the HTML5 Notification API, providing additional functionality that is useful for financial desktop applications.
>
>The exact visual style and the extent of the OS-level integration is container dependent and hence out-of-scope of this specification.

The notification API that we propose is following the HTML5 notifications standard (https://developer.mozilla.org/en-US/docs/Web/API/notification)

If we need any extensions these can be added on top of it.

## [Version API](https://symphonyoss.atlassian.net/wiki/display/WGDWAPI/Version+API)
> This API allows the JS web app to interrogate the container to find version support information.  One possible use case is to get ssf API version supported so that in future it is possible to deprecate older containers that do not support latest version of API.  Another possible use case is for logging purposes to help support track down issues.

There is an info section in the API that provides the api version and also container information (version, capabilities, etc)

```javascript
var apiVersion = ssf.info.apiVersion;
```