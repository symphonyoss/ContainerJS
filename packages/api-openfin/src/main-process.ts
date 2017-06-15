import MessageService from './message-service';

// Code that is "evaled" when the main window has been opened, sets up
// all the InterApplicationBus listeners for window events to keep track of state
const mainWindowCode = () => {
  const childTree = [];

  const addParent = (parentName, windowName, tree) => {
    let win = tree.find(w => w.name === parentName);
    if (win) {
      win.children.push({
        name: windowName,
        children: []
      });
      return true;
    } else {
      return tree.some((childWin) => {
        return addParent(parentName, windowName, childWin.children);
      });
    }
  };

  const getParentWindow = (name, parentName, tree) => {
    let win = tree.find(w => w.name === name);
    if (win) {
      return parentName;
    } else {
      let parentName = null;
      tree.some((childWin) => {
        parentName = getParentWindow(name, childWin.name, childWin.children);
        return parentName !== null;
      });
      return parentName;
    }
  };

  const getChildWindows = (name, tree) => {
    let win = tree.find(w => w.name === name);
    if (win) {
      return win.children.map(c => c.name);
    } else {
      let childNames = [];
      tree.some((childWin) => {
        childNames = getChildWindows(name, childWin.children);
        return childNames && childNames.length > 0;
      });
      return childNames;
    }
  };

  const deleteWindow = (name, tree) => {
    let index = tree.findIndex(w => w.name === name);
    if (index >= 0) {
      tree.splice(index, 1);
    } else {
      tree.forEach((childWin) => {
        deleteWindow(name, childWin.children);
      });
    }
  };

  fin.desktop.InterApplicationBus.subscribe('*', 'ssf-new-window', (data) => {
    if (data.parentName === null) {
      childTree.push({
        name: data.windowName,
        children: []
      });
    } else {
       if (!addParent(data.parentName, data.windowName, childTree)) {
        // No parent in tree, make a new one
        childTree.push({
          name: data.parentName,
          children: [{
            name: data.windowName,
            children: []
          }]
        });
      }
    }
  });

  fin.desktop.InterApplicationBus.subscribe('*', 'ssf-get-parent-window', (name, uuid) => {
    const parent = getParentWindow(name, null, childTree);
    fin.desktop.InterApplicationBus.send(uuid, 'ssf-parent-window', parent);
  });

  fin.desktop.InterApplicationBus.subscribe('*', 'ssf-get-child-windows', (name, uuid) => {
    const children = getChildWindows(name, childTree);
    fin.desktop.InterApplicationBus.send(uuid, 'ssf-child-windows', children);
  });

  fin.desktop.InterApplicationBus.subscribe('*', 'ssf-window-close', (message, uuid) => {
    deleteWindow(uuid, childTree);
    // If that was the last window to close, force close this window too
    if (childTree.length === 0) {
      fin.desktop.Window.getCurrent().close(true);
    }
  });

  fin.desktop.Window.getCurrent().addEventListener('close-requested', () => {
    fin.desktop.InterApplicationBus.publish('ssf-close-all', '');
    fin.desktop.Window.getCurrent().close(true);
  });
};

const createMainProcess = () => {
  // Create the main window, if the window already exists, the success callback isn't ran
  // and the already open window is returned
  let mainWindow;
  const app = new fin.desktop.Application({
    url: 'about:blank',
    name: 'mainWindow',
    uuid: 'mainWindow',
    mainWindowOptions: {
      autoShow: true
    }
  }, () => {
    app.run(() => {
      mainWindow = app.getWindow();
      // executeJavaScript only takes a string, but writing the code as a string means we lose typescript checking
      const body = mainWindowCode.toString().slice(mainWindowCode.toString().indexOf("{") + 1, mainWindowCode.toString().lastIndexOf("}"));
      mainWindow.executeJavaScript(body);
    });
  });
}

export default createMainProcess;
