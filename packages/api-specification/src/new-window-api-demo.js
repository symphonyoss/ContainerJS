var newWindowButton = document.getElementById('new-window-test');

newWindowButton.onclick = function() {
  var url = document.getElementById('url').value;
  window.open(url, 'newWin');
};
