class BrowserNotification implements ssf.Notification {
  constructor(title: string, options: ssf.NotificationOptions) {
    new Notification(title, options);
  }
    
  static requestPermission(): Promise<ssf.NotificationPermission> {
    return Notification.requestPermission();
  }
}

export default BrowserNotification;
