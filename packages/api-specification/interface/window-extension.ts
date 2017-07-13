/*
 * Both of these are needed for screen orientation in OpenFin and Browser.
 * This is because screen orientation is a non standard feature, even though
 * it is implemented in Chrome and FireFox browsers, so there are no typings.
 * This gives us the typings, although a very stripped down version
 */

/**
 * @ignore
 */
declare interface Screen {
  orientation: Orientation;
}

/**
 * @ignore
 */
interface Orientation {
  angle: number;
}
