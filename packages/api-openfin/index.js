/* globals fin  */
window.Notification = function(title, options) {
  const message = {
    title: title,
    options: options
  };

  // eslint-disable-next-line no-new
  new fin.desktop.Notification({
    url: 'notification.html',
    message: message
  });
};
