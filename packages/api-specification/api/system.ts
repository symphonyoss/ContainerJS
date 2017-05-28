import {Bounds, Size} from "./common";

export interface SystemAPI {
    /**
     * Info about all displays available
     */
    displays: () => Display[];

    /**
     * Capture
     * @param options
     */
    capture: (options?: CaptureOptions) => Promise<Base64ImageData>;

    /**
     * Capture specific display
     * @param displayId
     * @param options
     */
    captureDisplay: (displayId: number, options?: CaptureOptions) => Promise<DisplayImageData>;

    captureAllDisplays: (options?: CaptureOptions) => Promise<DisplayImageData>;

    /**
     * Capture specific window
     * @param windowId
     * @param options
     */
    captureWindow: (windowId: string, options?: CaptureOptions) => Promise<WindowImageData>;

    /**
     * Capture all windows in a separate images
     * @param options
     */
    captureAllWindows: (options?: CaptureOptions) => Promise<WindowImageData>;

    /**
     * Whenever user activity occurs (keyboard or mouse input) the callback will be invoked.
     * If additional activity occurs within the period given by the 'throttle', then the callback will be
     * invoked at time: X + throttle (where X is the time of last activity report send).
     */
    onUserActivity(callback: ()=> void, throtle: number);

    /**
     * Operating system information
     */
    os: OperatingSystemInfo;
}

export interface Display {
    /** Unique identifier associated with the display. */
    id: number;

    /** Can be 0, 90, 180, 270, represents screen rotation in clock-wise degrees. */
    rotation: number;

    /** Output device's pixel scale factor. */
    scaleFactor: number;

    /** True if this is the primary display */
    primary: boolean;

    /** Bounds of the display **/
    bounds: Bounds;

    /** Working area of the display */
    workingArea: Bounds;

    capture(): Promise<DisplayImageData>;
}

export interface OperatingSystemInfo{
    platform: 'Windows' | 'OSX' | 'Linux';
    version: string;
    is64bit: boolean;
}

export interface CaptureOptions {
    imageSize: Size;
}

export interface DisplayImageData extends Base64ImageData{
    display: Display;
}

export interface WindowImageData extends Base64ImageData {
    window: Window;
}

export interface Base64ImageData {
    type: string;
    data: string;
    width: number;
    height: number;
}