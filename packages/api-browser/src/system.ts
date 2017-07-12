const browserDisplayMap = (display: Screen, primary: boolean): ssf.Display => {
  return {
    id: 'primary',
    rotation: 0,
    scaleFactor: 1,
    bounds: {
      left: 0,
      right: display.width,
      top: 0,
      bottom: display.height
    },
    primary
  };
};

class System implements ssf.SystemAPI {
  static getDisplays() {
    return new Promise<ssf.Display[]>(resolve => {
      resolve([browserDisplayMap(window.screen, true)]);
    });
  }
}

export default System;
