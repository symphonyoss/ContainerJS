## Overview
The Messaging API is used to communicate between windows

### Methods
The `MessageService` class exposes the following static methods:</p>
```javascript
send(windowId, topic, message)
subscribe(windowId, topic, listener)
```

### Syntax
**send**  
```javascript
ssf.MessageService.send(windowId, topic, message);
```
Sends a message to a specified window
* `windowId` - id of the destination window.
* `topic` - the topic of the message.
* `message` - any serializable data to pass to the window.

**subscribe**  
```javascript
ssf.MessageService.subscribe(windowId, topic, listener);
```
Subscribes to messages from a specific window/topic. Window id can also be a wildcard (*) to receive messages from all windows.
* `windowId` - id of the sending window.
* `topic` - the topic to listen for.
* `listener` - callback that is invoked when a message is received with 2 paramaters: message and senderid.

**unsubscribe**  
```javascript
ssf.MessageService.subscribe(windowId, topic, listener);
```
Unsubscribes from messages from a particular window and topic that has already been subscribed to
* `windowId` - id of the sending window.
* `topic` - the topic that was subscribed to.
* `listener` - the listener that was passed to subscribe.
