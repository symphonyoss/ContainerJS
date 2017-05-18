class MessageService implements ssf.MessageService {
  // Window ID should be in the form 'application-uuid:window-name'
  static send(windowId, topic, message) {
    const [appId, windowName] = windowId.split(':');

    if (appId && windowName) {
      fin.desktop.InterApplicationBus.send(appId, windowName, topic, message);
    } else if (appId) {
      fin.desktop.InterApplicationBus.send(appId, topic, message);
    }
  }

  static subscribe(windowId, topic, listener) {
    const [appId, windowName] = windowId.split(':');

    if (appId && windowName) {
      fin.desktop.InterApplicationBus.subscribe(appId, windowName, topic, listener);
    } else if (appId) {
      fin.desktop.InterApplicationBus.subscribe(appId, topic, listener);
    }
  }

  static unsubscribe(windowId, topic, listener) {
    const [appId, windowName] = windowId.split(':');

    if (appId && windowName) {
      fin.desktop.InterApplicationBus.unsubscribe(appId, windowName, topic, listener);
    } else if (appId) {
      fin.desktop.InterApplicationBus.unsubscribe(appId, topic, listener);
    }
  }
}

export default MessageService;
