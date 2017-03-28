const ipc = require('electron').ipcRenderer;

const listenerMap = new Map();

class MessageService {
  static send(windowId, topic, message) {
    ipc.send('ssf-send-message', {
      windowId,
      topic,
      message
    });
  }

  static subscribe(windowId, topic, listener) {
    const receiveMessage = (message, sender) => {
      // Check this was from the correct window
      if (windowId === sender.toString() || windowId === '*') {
        listener(message, sender);
      }
    };

    ipc.on(`ssf-send-message-${topic}`, receiveMessage);

    // Map the arguments to the actual listener that was added
    listenerMap.set({
      windowId,
      topic,
      listener
    }, receiveMessage);
  }

  static unsubscribe(windowId, topic, listener) {
    let deleteKey = null;

    // We cant use listenerMap.has() here because reconstructing the key from the arguments is a different object
    // i.e. {} !== {}
    listenerMap.forEach((value, key) => {
      if (key.windowId === windowId && key.topic === topic && key.listener === listener) {
        ipc.removeListener(`ssf-send-message-${topic}`, value);
        deleteKey = key;
      }
    });

    listenerMap.delete(deleteKey);
  }
}

export default MessageService;
