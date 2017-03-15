var button = document.getElementById('notification-test');

// if the environment this code is running in requires that the user grants permission
// before raising a notification, then do so!
function withNotificationPermission() {
  return new Promise(function(resolve, reject) {
    if (Notification.hasOwnProperty('permission')) {
      // if permission already granted, we're good to go
      if (Notification.permission === 'granted') {
        resolve(true);
      // if denied, request permission
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function(permission) {
          if (permission === 'granted') {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      }
    } else {
      resolve(true);
    }
  });
}

button.onclick = function() {
  if (!('Notification' in window)) {
    console.error('This browser / container does not support system notifications');
    return;
  }

  withNotificationPermission()
    .then(function(hasPermission) {
      if (!hasPermission) {
        console.error('notification permission not granted');
        return;
      }

      var title = document.getElementById('title').value;
      var body = document.getElementById('body').value;
      // eslint-disable-next-line no-new
      new Notification(title, {
        body: body
      });
    });
};
