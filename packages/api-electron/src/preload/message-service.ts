const ipc = require('electron').ipcRenderer;
import { IpcMessages } from '../common/constants';

const listenerMap = new Map();

class MessageService {
  static send(windowId, topic, message) {
    ipc.send(IpcMessages.IPC_SSF_SEND_MESSAGE, {
      windowId,
      topic,
      message
    });
  }

  static subscribe(windowId, topic, listener) {
    const receiveMessage = (event, message, sender) => {
      // Check this was from the correct window
      if (windowId === sender.toString() || windowId === '*') {
        listener(message, sender);
      }
    };

    ipc.on(`${IpcMessages.IPC_SSF_SEND_MESSAGE}-${topic}`, receiveMessage);

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
        ipc.removeListener(`${IpcMessages.IPC_SSF_SEND_MESSAGE}-${topic}`, value);
        deleteKey = key;
      }
    });

    listenerMap.delete(deleteKey);
  }
}

export default MessageService;
