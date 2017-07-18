const ofDisplayMap = (display: fin.MonitorInfoDetail, primary: boolean): ssf.Display => {
  return {
    id: display.deviceId,
    rotation: window.screen.orientation.angle,
    scaleFactor: window.devicePixelRatio,
    primary,
    bounds: {
      x: display.monitorRect.left,
      y: display.monitorRect.top,
      width: display.monitorRect.right - display.monitorRect.left,
      height: display.monitorRect.bottom - display.monitorRect.top
    }
  };
};

export class Screen implements ssf.Screen {
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
