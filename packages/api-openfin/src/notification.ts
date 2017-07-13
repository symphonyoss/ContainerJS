import { Uri, Emitter } from 'containerjs-api-utility';
const PERMISSION_GRANTED: ssf.NotificationPermission = 'granted';

class Notification extends Emitter implements ssf.Notification {
  constructor(title: string, options: ssf.NotificationOptions) {
    super();

    if (!options) {
      options = {};
    }

    const message = {
      title,
      text: options.body,
      image: Uri.getAbsoluteUrl(options.image),
      icon: Uri.getAbsoluteUrl(options.icon)
     };

    // eslint-disable-next-line no-new
    new fin.desktop.Notification({
      url: Uri.getAbsoluteUrl('notification.html'),
      message,
      onClick: data => this.emit('click', data)
    });
  }

  static requestPermission(): Promise<ssf.NotificationPermission> {
    return Promise.resolve(PERMISSION_GRANTED);
  }
}
export default Notification;
