var newWindowButton = document.getElementById('new-window-test');

newWindowButton.onclick = function() {
  var url = document.getElementById('url').value;
  var windowName = document.getElementById('name').value;
  var isChild = document.getElementById('child').checked ? 'yes' : 'no';
  ssf.window(url, windowName, 'child=' + isChild);
};
