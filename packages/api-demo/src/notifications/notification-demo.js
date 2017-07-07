var button = document.getElementById('notification-test');

button.onclick = function() {
  ssf.Notification.requestPermission()
    .then(function(permission) {
      if (permission !== 'granted') {
        console.error('notification permission not granted');
        return;
      }

      var title = document.getElementById('title').value;
      var body = document.getElementById('body').value;
      // eslint-disable-next-line no-new
      new ssf.Notification(title, {
        body: body,
        icon: 'notification-icon.png',
        image: 'notification-image.png'
      });
    });
};
