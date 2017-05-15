interface Window {
  Notification: any;
}

window.Notification = function(title, options) {
  if (!options) {
    options = {};
  }

  const message = {
    title: title,
    text: options.body
  };

  // eslint-disable-next-line no-new
  new fin.desktop.Notification({
    url: 'notification.html',
    message: message
  });
};
