const ofDisplayMap = (display: fin.MonitorInfoDetail, primary: boolean): ssf.Display => {
  return {
    id: display.deviceId,
    rotation: window.screen.orientation.angle,
    scaleFactor: window.devicePixelRatio,
    primary,
    bounds: {
      x: display.availableRect.left,
      y: display.availableRect.top,
      width: display.availableRect.right - display.availableRect.left,
      height: display.availableRect.bottom - display.availableRect.top
    }
  };
};

class Screen implements ssf.Screen {
  static getDisplays() {
    return new Promise<ssf.Display[]>(resolve => {
      fin.desktop.System.getMonitorInfo((info) => {
        const displays = [];
        info.nonPrimaryMonitors.forEach(monitor => displays.push(ofDisplayMap(monitor, false)));
        displays.push(ofDisplayMap(info.primaryMonitor, true));
        resolve(displays);
      });
    });
  }
}

export default Screen;
