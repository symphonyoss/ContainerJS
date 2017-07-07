const remote = require('electron').remote;
const eNotify = remote.require('electron-notify');
const PERMISSION_GRANTED: ssf.NotificationPermission = 'granted';

// Image style moves the image below the icon and title/body,
// to match the style of native notifications
const imageStyle = {
        overflow: 'hidden',
        display: 'block',
        position: 'absolute',
        bottom: 10
      };
const HEIGHT_WITHOUT_IMAGE = 65;
const HEIGHT_WITH_IMAGE = 175;

class Notification implements ssf.Notification {
  constructor(title: string, options: ssf.NotificationOptions) {
    if (!options) {
      options = {};
    }

    eNotify.setConfig({
      appIcon: this.getAbsoluteUrl(options.icon),
      height: options.image ? HEIGHT_WITH_IMAGE : HEIGHT_WITHOUT_IMAGE,
      defaultStyleImage: imageStyle
    });

    eNotify.notify({
      title: title,
      text: options.body,
      image: this.getAbsoluteUrl(options.image)
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
