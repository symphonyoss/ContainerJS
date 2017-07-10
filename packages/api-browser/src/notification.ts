import EventEmitter from './event-emitter';

class BrowserNotification extends EventEmitter implements ssf.Notification {
  innerNotification: Notification;

  constructor(title: string, options: ssf.NotificationOptions) {
    super(eventMap);
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

const eventMap = {
  'click': 'click'
};

export default BrowserNotification;
