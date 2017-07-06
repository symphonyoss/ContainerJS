const remote = require('electron').remote;
const eNotify = remote.require('electron-notify');
const PERMISSION_GRANTED = "granted";

class ElectronNotification implements ssf.Notification {
  constructor(title: string, options: NotificationOptions) {
    if (!options) {
      options = {};
    }

    eNotify.notify({
      title: title,
      text: options.body
    });
  }
    
  static permission: string = PERMISSION_GRANTED;
  static requestPermission(callback: (NotificationPermissionCallback)) {
    callback(PERMISSION_GRANTED);
  }
}

window.Notification = ElectronNotification;
