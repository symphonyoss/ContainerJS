var button = document.getElementById('screen-snippet-test');
var preview = document.getElementById('screen-snippet-test-preview');

function updateStatusText(text) {
  document.getElementById('screen-snippet-test-status').textContent = text;
}

function updateErrorText(text) {
  document.getElementById('screen-snippet-test-error').textContent = text;
}

function appReady() {
  var mySnippet = new ssf.WindowCore();

  button.onclick = function() {
    preview.src = '';
    preview.style.display = 'none';

    updateStatusText('Capturing screen snippet...');
    updateErrorText('');
    mySnippet.capture()
      .then((dataUri) => {
        updateStatusText('Screen snippet captured!');
        preview.src = dataUri;
        preview.style.display = 'block';
      })
      .catch((error) => {
        updateStatusText('Screen snippet error!');
        updateErrorText(error.message || '');
      });
  };
}

ssf.app.ready().then(appReady);
