import { BrowserScreen } from './browser-screen';

const browserDisplayMap = (display: BrowserScreen, primary: boolean): ssf.Display => {
  return {
    id: 'primary',
    rotation: display.orientation.angle,
    scaleFactor: window.devicePixelRatio,
    bounds: {
      x: screenX,
      width: display.width,
      y: screenY,
      height: display.height
    },
    primary
  };
};

export class Screen implements ssf.Screen {
  static getDisplays() {
    return new Promise<ssf.Display[]>(resolve => {
      resolve([browserDisplayMap(window.screen, true)]);
    });
  }
}
