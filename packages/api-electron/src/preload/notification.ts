const remote = require('electron').remote;
const eNotify = remote.require('electron-notify');
const PERMISSION_GRANTED: ssf.NotificationPermission = 'granted';

class Notification implements ssf.Notification {
  constructor(title: string, options: ssf.NotificationOptions) {
    if (!options) {
      options = {};
    }

    eNotify.notify({
      title: title,
      text: options.body
    });
  }

  static requestPermission(): Promise<ssf.NotificationPermission> {
    return Promise.resolve(PERMISSION_GRANTED);
  }
}

export default Notification;
