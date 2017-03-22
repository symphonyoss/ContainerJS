const messageBox = document.getElementById('message-box');
const sendButton = document.getElementById('send-message');
const newWindowButton = document.getElementById('new-window');

const appReady = ssf.app.ready();

const windowDetailsId = document.getElementById('window-uuid');
windowDetailsId.innerText = ssf.Window.getCurrentWindowId();

newWindowButton.onclick = () => {
  // Create a random hex string as the window name
  const id = (((1 + Math.random()) * 0x1000000) | 0).toString(16).substring(1);

  const isChild = document.getElementById('child').checked ? 'yes' : 'no';

  appReady.then(() => {
    // eslint-disable-next-line no-new
    new ssf.Window('http://localhost:5000/messaging-api-test-window.html', id, 'child=' + isChild);

    ssf.MessageService.subscribe('*', 'test', (message, senderId) => {
      messageBox.innerText = '\'' + message + '\' from ' + senderId;
    });
  });
};

sendButton.onclick = () => {
  const uuid = document.getElementById('uuid').value;
  const message = document.getElementById('message').value;
  ssf.MessageService.send(uuid, 'test', message);
};
