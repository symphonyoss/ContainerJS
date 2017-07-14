const accessibleWindows: Map<string, Window> = new Map();

// If we have an opener, we are not the parent so we need to add it as a window
if (window.opener) {
  // The reference to the opener is not the full window object, so there is no onclose handler available
  accessibleWindows['parent'] = window.opener;
} else {
  window.name = 'parent';
}

export const getAccessibleWindows = () => accessibleWindows;
export const getAccessibleWindow = (name: string) => accessibleWindows[name];

export const addAccessibleWindow = (name: string, win: Window) => {
  accessibleWindows[name] = win;
};

export const removeAccessibleWindow = (name: string) => {
  delete accessibleWindows[name];
};
