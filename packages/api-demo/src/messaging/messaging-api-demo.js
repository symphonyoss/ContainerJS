const messageBox = document.getElementById('message-box');
const sendButton = document.getElementById('send-message');
const newWindowButton = document.getElementById('new-window');
const subscribeButton = document.getElementById('subscribe-button');
const unsubscribeButton = document.getElementById('unsubscribe-button');

const appReady = ssf.app.ready();

appReady.then(() => {
  const windowDetailsId = document.getElementById('window-uuid');
  windowDetailsId.innerText = ssf.Window.getCurrentWindow().getId();

  newWindowButton.onclick = () => {
    // Create a random hex string as the window name
    const id = (((1 + Math.random()) * 0x1000000) | 0).toString(16).substring(1);

    const isChild = document.getElementById('child').checked;

    const path = location.href.substring(0, location.href.lastIndexOf('/'))

    // eslint-disable-next-line no-new
    new ssf.Window({
      child: isChild,
      name: id,
      show: true,
      url: `${path}/messaging-api-test-window.html`
    });
  };

  sendButton.onclick = () => {
    const uuid = document.getElementById('uuid').value;
    const message = document.getElementById('message').value;
    ssf.MessageService.send(uuid, 'test', message);
  };

  const messageReceived = (message, senderId) => {
    messageBox.innerText = '\'' + message + '\' from ' + senderId;
  };

  subscribeButton.onclick = () => {
    ssf.MessageService.subscribe('*', 'test', messageReceived);
  };

  unsubscribeButton.onclick = () => {
    ssf.MessageService.unsubscribe('*', 'test', messageReceived);
  };
});
