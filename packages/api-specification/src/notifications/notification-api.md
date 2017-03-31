## Overview
The Notifications API is used to configure and display desktop notifications to the user. It is exposed as an extension to the [HTML5 Notification API](https://developer.mozilla.org/en/docs/Web/API/notification), providing additional functionality that is useful for financial desktop applications.

The exact visual style and the extent of the OS-level integration is container dependent and hence out-of-scope of this specification.

### Constructor

```javascript
Notification()
```

Creates a new instance of the Notification object.

### Syntax

```
var myNotification = new Notification(title, options);
```

### Parameters

**title**  
Defines a title for the notification, which will be shown at the top of the notification window when it is fired.

**options (optional)**  
An options object containing any custom settings that you want to apply to the notification. These options can container the standard HTML5 notification API options
* `dir` - ...
* `lang` - ...

In addition, the following ‘extension’ options are supported:  
**NOTE:** These properties are currently illustrative!

* `ssfBlink` - causes the notification to blink
* `ssfBlinkColor` - the color used for the blinking effect
