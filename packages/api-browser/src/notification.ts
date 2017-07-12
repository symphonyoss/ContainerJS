import { Emitter } from 'containerjs-api-utility';

class BrowserNotification extends Emitter implements ssf.Notification {
  innerNotification: Notification;

  constructor(title: string, options: ssf.NotificationOptions) {
    super();
    this.innerNotification = new Notification(title, options);
  }

  innerAddEventListener(eventName: string, handler: (...args: any[]) => void) {
    this.innerNotification.addEventListener(eventName, handler);
  }

  innerRemoveEventListener(eventName: string, handler: (...args: any[]) => void) {
    this.innerNotification.removeEventListener(eventName, handler);
  }

  static requestPermission(): Promise<ssf.NotificationPermission> {
    return Notification.requestPermission();
  }
}

export default BrowserNotification;
