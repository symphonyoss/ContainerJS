const accessibleWindows: Map<string, Window> = new Map();

export const initialise = () => {
  // If we have an opener, we are not the parent so we need to add it as a window
  if (window.opener) {
    // The reference to the opener is not the full window object, so there is no onclose handler available
    accessibleWindows['parent'] = window.opener;
  } else {
    window.name = 'parent';
  }

  window.addEventListener('message', event => {
    // Redistribute message up/down the tree
    distributeMessage(event.data);
  }, false);
};

export const getAccessibleWindows = () => accessibleWindows;
export const getAccessibleWindow = (name: string) => accessibleWindows[name];

export const addAccessibleWindow = (name: string, win: Window) => {
  accessibleWindows[name] = win;
};

export const removeAccessibleWindow = (name: string) => {
  delete accessibleWindows[name];
};

interface MessageDetails {
  senderId: string;
  windowId: string; // May be wildcard "*"
  topic: string;
  message: any;
  receivedFromId?: string;
}

export const distributeMessage = (messageDetails: MessageDetails): void => {
  // Using receivedFromId avoids sending it back the way it came
  const packet = Object.assign({}, messageDetails, {
    receivedFromId: window.name
  });

  const windows = getAccessibleWindows();
  for (const name in windows) {
    if (windows.hasOwnProperty(name)
        && name !== messageDetails.receivedFromId
        && name !== messageDetails.senderId) {
      const win = windows[name];
      win.postMessage(packet, '*');
    }
  }
};
