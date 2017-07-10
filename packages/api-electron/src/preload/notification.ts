const remote = require('electron').remote;
const eNotify = remote.require('electron-notify');
import { Uri } from 'containerjs-api-utility';

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
const HEIGHT_WITH_IMAGE = 100;

class Notification implements ssf.Notification {
  constructor(title: string, options: ssf.NotificationOptions) {
    if (!options) {
      options = {};
    }

    eNotify.setConfig({
      appIcon: Uri.getAbsoluteUrl(options.icon),
      height: options.image ? HEIGHT_WITH_IMAGE : HEIGHT_WITHOUT_IMAGE,
      defaultStyleImage: imageStyle
    });

    eNotify.notify({
      title: title,
      text: options.body,
      image: Uri.getAbsoluteUrl(options.image)
    });
  }

  static requestPermission(): Promise<ssf.NotificationPermission> {
    return Promise.resolve(PERMISSION_GRANTED);
  }
}

export default Notification;
