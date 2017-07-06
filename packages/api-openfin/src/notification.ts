const PERMISSION_GRANTED: ssf.NotificationPermission = 'granted';

class Notification implements ssf.Notification {
  constructor(title: string, options: ssf.NotificationOptions) {
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
    
  static requestPermission(): Promise<ssf.NotificationPermission> {
    return Promise.resolve(PERMISSION_GRANTED);
  }
}
export default Notification;
