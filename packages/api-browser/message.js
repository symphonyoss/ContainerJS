if (!window.ssf) {
  window.ssf = {};
}

class MessageService {
  static send(windowId, topic, message) {
    const win = window.accessableWindows.find((w) => w.id.toString() === windowId);
    const senderId = window.ssf.Window.getCurrentWindowId();
    if (win) {
      win.window.postMessage({
        senderId,
        topic,
        message
      }, '*');
    }
  }

  static subscribe(windowId, topic, listener) {
    const receiveMessage = (event) => {
      if ((windowId === '*' || windowId === event.data.senderId) && topic === event.data.topic) {
        listener(event.data.message, event.data.senderId);
      }
    };

    window.addEventListener('message', receiveMessage, false);
  }
}

window.ssf.MessageService = MessageService;
