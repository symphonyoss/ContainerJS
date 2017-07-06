const PERMISSION_GRANTED = "granted";

if ('fin' in window) {
  class OpenFinNotification implements ssf.Notification {
    constructor(title: string, options: NotificationOptions) {
      if (!options) {
        options = {};
      }

      const message = {
        title: title,
        text: options.body
      };

      // eslint-disable-next-line no-new
      new fin.desktop.Notification({
        url: 'notification.html',
        message: message
      });
    }
      
    static permission: string = PERMISSION_GRANTED;
    static requestPermission(callback: (NotificationPermissionCallback)) {
      callback(PERMISSION_GRANTED);
    }
  }

  window.Notification = OpenFinNotification;
}
