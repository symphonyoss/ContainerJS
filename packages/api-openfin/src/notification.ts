const PERMISSION_GRANTED: ssf.NotificationPermission = 'granted';

class Notification implements ssf.Notification {
  constructor(title: string, options: ssf.NotificationOptions) {
    if (!options) {
      options = {};
    }

    const message = {
      title: title,
      text: options.body,
      image: this.getAbsoluteUrl(options.image),
      icon: this.getAbsoluteUrl(options.icon)
     };

    // eslint-disable-next-line no-new
    new fin.desktop.Notification({
      url: this.getAbsoluteUrl('notification.html'),
      message: message
    });
  }

  getAbsoluteUrl(url) {
    if (url && !url.startsWith('http:') && !url.startsWith('http:')) {
      const path = url.startsWith('/')
          ? location.origin
          : location.href.substring(0, location.href.lastIndexOf('/'));

      return `${path}/${url}`
    }
    return url
  }

  static requestPermission(): Promise<ssf.NotificationPermission> {
    return Promise.resolve(PERMISSION_GRANTED);
  }
}
export default Notification;
