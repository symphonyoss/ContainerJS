declare namespace ssf {
  export abstract class SystemAPI {
    static getDisplays(): Promise<Array<Display>>;
  }

  export interface Display {
    id: string;

    rotation: number;

    scaleFactor: number;

    primary: boolean;

    bounds: ssf.Bounds;
  }

  export interface Bounds {
    left: number;

    right: number;

    top: number;

    bottom: number;
  }
}
