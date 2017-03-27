const ipc = require('electron').ipcRenderer;

class MessageService {
  static send(windowId, topic, message) {
    ipc.send('ssf-send-message', {
      windowId,
      topic,
      message
    });
  }

  static subscribe(windowId, topic, listener) {
    ipc.on(`ssf-send-message-${topic}`, (message, sender) => {
      // Check this was from the correct window
      if (windowId === sender || windowId === '*') {
        listener(message, sender);
      }
    });
  }
}

export default MessageService;
