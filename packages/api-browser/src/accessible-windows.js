const accessibleWindows = {};

// if we have an opener, we are not the parent so we need to add it as a window
if (window.opener) {
  // The reference to the opener is not the full window object, so there is no onclose handler available
  accessibleWindows['parent'] = window.opener;
} else {
  window.name = 'parent';
}

export const getAccessibleWindows = () => accessibleWindows;
export const getAccessibleWindow = (name) => accessibleWindows[name];

export const addAccessibleWindow = (name, win) => {
  accessibleWindows[name] = win;
};

export const removeAccessibleWindow = (name) => {
  delete accessibleWindows[name];
};
