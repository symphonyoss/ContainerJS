import { Uri } from 'containerjs-api-utility';
const PERMISSION_GRANTED: ssf.NotificationPermission = 'granted';

class Notification implements ssf.Notification {
  constructor(title: string, options: ssf.NotificationOptions) {
    if (!options) {
      options = {};
    }

    const message = {
      title: title,
      text: options.body,
      image: Uri.getAbsoluteUrl(options.image),
      icon: Uri.getAbsoluteUrl(options.icon)
     };

    // eslint-disable-next-line no-new
    new fin.desktop.Notification({
      url: Uri.getAbsoluteUrl('notification.html'),
      message: message
    });
  }

  static requestPermission(): Promise<ssf.NotificationPermission> {
    return Promise.resolve(PERMISSION_GRANTED);
  }
}
export default Notification;
