/*
 * Only necessary in Electron and OpenFin as browser does not know about
 * more than 1 screen.
 */
export class Display {
  static getDisplayAlteredPosition(displayId: string, position: ssf.Position) {
    if (!displayId) {
      return Promise.resolve({x: undefined, y: undefined});
    }

    return ssf.Screen.getDisplays().then((displays) => {
      const display = displays.filter(d => d.id === displayId)[0];
      return {
        x: display.bounds.x + position.x,
        y: display.bounds.y + position.y
      };
    });
  }
}
