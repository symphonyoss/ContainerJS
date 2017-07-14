import MessageService from './message-service';

type ChildTree = {
  name: string,
  children: ChildTree[]
};

type NewWindowMessage = {
  windowName: string,
  parentName: string
};
// Code that is "evaled" when the main window has been opened, sets up
// All the InterApplicationBus listeners for window events to keep track of state
const mainWindowCode = () => {
  const childTree: ChildTree[] = [];

  const addParent = (parentName: string, windowName: string, tree: ChildTree[]): boolean => {
    const win = tree.find(w => w.name === parentName);
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

  const getParentWindow = (name: string, parentName: string, tree: ChildTree[]) => {
    const win = tree.find(w => w.name === name);
    if (win) {
      return parentName;
    } else {
      let parentName: string = null;
      tree.some((childWin) => {
        parentName = getParentWindow(name, childWin.name, childWin.children);
        return parentName !== null;
      });
      return parentName;
    }
  };

  const getChildWindows = (name: string, tree: ChildTree[]) => {
    const win = tree.find(w => w.name === name);
    if (win) {
      return win.children.map(c => c.name);
    } else {
      let childNames: string[] = [];
      tree.some((childWin) => {
        childNames = getChildWindows(name, childWin.children);
        return childNames && childNames.length > 0;
      });
      return childNames;
    }
  };

  const deleteWindow = (name: string, tree: ChildTree[]) => {
    const index = tree.findIndex(w => w.name === name);
    if (index >= 0) {
      tree.splice(index, 1);
    } else {
      tree.forEach((childWin) => {
        deleteWindow(name, childWin.children);
      });
    }
  };

  const closeChildren = (uuid: string) => {
    const childUuids = getChildWindows(uuid, childTree);
    childUuids.forEach((child) => {
      fin.desktop.Application.wrap(child).close(true);
      closeChildren(child);
    });
  };

  const getAllWindows = (node: ChildTree[]) => {
    let windows = [];
    node.forEach((win) => {
      windows.push(win.name);
      if (win.children) {
        windows = windows.concat(getAllWindows(win.children));
      }
    });
    return windows;
  };

  fin.desktop.InterApplicationBus.subscribe('*', 'ssf-new-window', (data: NewWindowMessage) => {
    const app = fin.desktop.Application.wrap(data.windowName);
    app.getWindow().addEventListener('closed', () => {
      closeChildren(data.windowName);
      deleteWindow(data.windowName, childTree);
      // If that was the last window to close, force close this window too
      if (childTree.length === 0) {
        fin.desktop.Window.getCurrent().close();
      }
    });

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

  fin.desktop.InterApplicationBus.subscribe('*', 'ssf-get-parent-window', (name: string, uuid: string) => {
    const parent = getParentWindow(name, null, childTree);
    fin.desktop.InterApplicationBus.send(uuid, 'ssf-parent-window', parent);
  });

  fin.desktop.InterApplicationBus.subscribe('*', 'ssf-get-child-windows', (name: string, uuid: string) => {
    const children = getChildWindows(name, childTree);
    fin.desktop.InterApplicationBus.send(uuid, 'ssf-child-windows', children);
  });

  fin.desktop.InterApplicationBus.subscribe('*', 'ssf-get-all-windows', (data: any, uuid: string) => {
    const windows = getAllWindows(childTree);
    fin.desktop.InterApplicationBus.send(uuid, 'ssf-all-windows', windows);
  });

  fin.desktop.Window.getCurrent().addEventListener('close-requested', () => {
    fin.desktop.InterApplicationBus.publish('ssf-close-all', '');
    fin.desktop.Window.getCurrent().close(true);
  });
};

export const createMainProcess = (done: (err?: any) => void) => {
  // Populate the current window variable
  ssf.Window.getCurrentWindow();

  fin.desktop.InterApplicationBus.subscribe('*', 'ssf-close-all', () => {
    fin.desktop.Window.getCurrent().close(true);
  });

  // Create the main window, if the window already exists, the success callback isn't ran
  // And the already open window is returned
  const app = new fin.desktop.Application({
    url: 'about:blank',
    name: 'mainWindow',
    uuid: 'mainWindow',
    mainWindowOptions: {
      autoShow: false
    }
  }, () => {
    app.run(() => {
      // Method executeJavaScript only takes a string, but writing the code as a string means we lose typescript checking
      const body = mainWindowCode.toString().slice(mainWindowCode.toString().indexOf('{') + 1, mainWindowCode.toString().lastIndexOf('}'));
      const mainWindow = app.getWindow();
      mainWindow.executeJavaScript(body, () => {
        // Tell the mainWindow about this window
        const uuid = fin.desktop.Window.getCurrent().uuid;
        fin.desktop.InterApplicationBus.publish('ssf-new-window', {
          windowName: uuid,
          parentName: null
        });
        done();
      });
    });
  }, (err) => done(err));
};
