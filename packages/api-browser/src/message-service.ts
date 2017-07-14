import Window from './window';
import { getAccessibleWindow } from './accessible-windows';

const listenerMap = new Map();

class MessageService implements ssf.MessageService {
  static send(windowId: string, topic: string, message: any) {
    const win = getAccessibleWindow(windowId);
    const senderId = Window.getCurrentWindow().getId();
    if (win) {
      win.postMessage({
        senderId,
        topic,
        message
      }, '*');
    }
  }

  static subscribe(windowId: string, topic: string, listener: (...args: any[]) => void) {
    const receiveMessage = (event) => {
      if ((windowId === '*' || windowId === event.data.senderId) && topic === event.data.topic) {
        listener(event.data.message, event.data.senderId);
      }
    };

    window.addEventListener('message', receiveMessage, false);

    // Map the arguments to the actual listener that was added
    listenerMap.set({
      windowId,
      topic,
      listener
    }, receiveMessage);
  }

  static unsubscribe(windowId: string, topic: string, listener: (...args: any[]) => void) {
    let deleteKey = null;

    // We cant use listenerMap.has() here because reconstructing the key from the arguments is a different object
    // i.e. {} !== {}
    listenerMap.forEach((value, key) => {
      if (key.windowId === windowId && key.topic === topic && key.listener === listener) {
        window.removeEventListener('message', listener);
        deleteKey = key;
      }
    });

    listenerMap.delete(deleteKey);
  }
}

export default MessageService;
