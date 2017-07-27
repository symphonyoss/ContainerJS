const listenerMap = new Map();

export class MessageService implements ssf.MessageService {
  // Window ID should be in the form 'application-uuid:window-name'
  static send(windowId: string, topic: string, message: any) {
    const [appId, windowName] = windowId.split(':');

    if (appId && windowName) {
      fin.desktop.InterApplicationBus.send(appId, windowName, topic, message);
    } else if (appId) {
      fin.desktop.InterApplicationBus.send(appId, topic, message);
    }
  }

  static subscribe(windowId: string, topic: string, listener: (message: string|object, sender: string) => void) {
    const thisWindowId = fin.desktop.Window.getCurrent().uuid;
    const receiveMessage = (message, senderId) => {
      // Don't send to self
      if (senderId !== thisWindowId) {
        listener(message, senderId);
      }
    };

    // Map the arguments to the actual listener that was added
    listenerMap.set({
      windowId,
      topic,
      listener
    }, receiveMessage);

    const [appId, windowName] = windowId.split(':');

    if (appId && windowName) {
      fin.desktop.InterApplicationBus.subscribe(appId, windowName, topic, receiveMessage);
    } else if (appId) {
      fin.desktop.InterApplicationBus.subscribe(appId, topic, receiveMessage);
    }
  }

  static unsubscribe(windowId: string, topic: string, listener: (message: string|object, sender: string) => void) {
    let deleteKey = null;
    let receiveMessage = null;

    // We cant use listenerMap.has() here because reconstructing the key from the arguments is a different object
    // I.e. {} !== {}
    listenerMap.forEach((value, key) => {
      if (key.windowId === windowId && key.topic === topic && key.listener === listener) {
        receiveMessage = value;
        deleteKey = key;
      }
    });

    if (deleteKey) {
      listenerMap.delete(deleteKey);

      const [appId, windowName] = windowId.split(':');

      if (appId && windowName) {
        fin.desktop.InterApplicationBus.unsubscribe(appId, windowName, topic, receiveMessage);
      } else if (appId) {
        fin.desktop.InterApplicationBus.unsubscribe(appId, topic, receiveMessage);
      }
    }
  }
}
