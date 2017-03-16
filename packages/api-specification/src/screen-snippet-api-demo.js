var MAX_CANVAS_WIDTH = 800;

var button = document.getElementById('screen-snippet-test');
var canvas = document.getElementById('screen-snippet-test-preview');
var canvasCtx = canvas.getContext('2d');
canvas.width = 0;
canvas.height = 0;

function updateStatusText(text) {
  document.getElementById('screen-snippet-test-status').textContent = text;
}

var mySnippet = new ssf.ScreenSnippet();

button.onclick = function() {
  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = 0;
  canvas.height = 0;
  canvas.style.display = 'none';

  updateStatusText('Capturing screen snippet...');
  mySnippet.capture()
    .then((imageBitmap) => {
      updateStatusText('Screen snippet captured!');
      canvas.width = Math.min(imageBitmap.width, MAX_CANVAS_WIDTH);
      canvas.height = canvas.width * imageBitmap.height / imageBitmap.width;
      canvasCtx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
      canvas.style.display = 'block';
    })
    .catch(() => {
      updateStatusText('Screen snippet error!');
    });
};
