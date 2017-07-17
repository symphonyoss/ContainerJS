import { Uri, Emitter } from 'containerjs-api-utility';
const PERMISSION_GRANTED: ssf.NotificationPermission = 'granted';
const DEFAULT_TEMPLATE: string = 'notification.html';

export class Notification extends Emitter implements ssf.Notification {
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

    const template = options.template || DEFAULT_TEMPLATE;

    new fin.desktop.Notification({
      url: Uri.getAbsoluteUrl(template),
      message,
      onClick: data => this.emit('click', data)
    });
  }

  static requestPermission(): Promise<ssf.NotificationPermission> {
    return Promise.resolve(PERMISSION_GRANTED);
  }
}
