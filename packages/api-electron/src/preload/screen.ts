const { remote } = require('electron');
const ElectronScreen = remote.screen;

const electronDisplayMap = (display: Electron.Display, primary: boolean): ssf.Display => {
  return {
    id: display.id.toString(),
    rotation: display.rotation,
    scaleFactor: display.scaleFactor,
    bounds: display.bounds,
    primary
  };
};

class Screen implements ssf.Screen {
  static getDisplays() {
    return new Promise<ssf.Display[]>(resolve => {
      const primaryDisplay = electronDisplayMap(ElectronScreen.getPrimaryDisplay(), true);
      const nonePrimaryDisplays = ElectronScreen.getAllDisplays()
        .filter(d => d.id.toString() !== primaryDisplay.id)
        .map(display => electronDisplayMap(display, false));

      resolve([primaryDisplay].concat(nonePrimaryDisplays));
    });
  }
}

export default Screen;
