if (!window.ssf) {
  window.ssf = {};
}

class MessageService {
  // Window ID should be in the form 'application-uuid:window-name'
  static send(windowId, topic, message) {
    const splitId = windowId.split(':');

    if (splitId.length > 1) {
      fin.desktop.InterApplicationBus.send(splitId[0], splitId[1], topic, message);
    } else if (splitId.length > 0) {
      fin.desktop.InterApplicationBus.send(splitId[0], topic, message);
    }
  }

  static subscribe(windowId, topic, listener) {
    const splitId = windowId.split(':');

    if (splitId.length > 1) {
      fin.desktop.InterApplicationBus.subscribe(splitId[0], splitId[1], topic, listener);
    } else if (splitId.length > 0) {
      fin.desktop.InterApplicationBus.subscribe(splitId[0], topic, listener);
    } else {
      fin.desktop.InterApplicationBus.subscribe('*', topic, listener);
    }
  }
}

window.ssf.MessageService = MessageService;
