var newWindowButton = document.getElementById('new-window-test');

const appReady = ssf.app.ready();

newWindowButton.onclick = function() {
  var url = document.getElementById('url').value;
  var windowName = document.getElementById('name').value;
  var isChild = document.getElementById('child').checked ? 'yes' : 'no';
  appReady.then(() => {
    // eslint-disable-next-line no-new
    new ssf.Window(url, windowName, 'child=' + isChild);
  });
};
