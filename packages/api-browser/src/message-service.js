import { getAccessibleWindow } from './accessible-windows';

class MessageService {
  static send(windowId, topic, message) {
    const win = getAccessibleWindow(windowId);
    const senderId = window.ssf.Window.getCurrentWindowId();
    if (win) {
      win.postMessage({
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

export default MessageService;
