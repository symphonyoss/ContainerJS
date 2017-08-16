import { distributeMessage } from './accessible-windows';

const listenerMap = new Map();

const currentWindowId = (): string => {
  return ssf.Window.getCurrentWindow().getId();
};

export class MessageService implements ssf.MessageService {
  static send(windowId: string, topic: string, message: any) {
    const senderId = currentWindowId();

    distributeMessage({
      senderId,
      windowId,
      topic,
      message
    });
  }

  static subscribe(windowId: string, topic: string, listener: (message: string|object, sender: string) => void) {
    const receiveMessage = (event) => {
      const thisId = currentWindowId();
      if ((windowId === '*' || windowId === event.data.senderId)
          && (event.data.windowId === '*' || thisId === event.data.windowId)
          && event.data.senderId !== thisId
          && topic === event.data.topic) {
        // Message intended for this window
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

  static unsubscribe(windowId: string, topic: string, listener: (message: string|object, sender: string) => void) {
    let deleteKey = null;

    // We cant use listenerMap.has() here because reconstructing the key from the arguments is a different object
    // I.e. {} !== {}
    listenerMap.forEach((value, key) => {
      if (key.windowId === windowId && key.topic === topic && key.listener === listener) {
        window.removeEventListener('message', value);
        deleteKey = key;
      }
    });

    listenerMap.delete(deleteKey);
  }
}
