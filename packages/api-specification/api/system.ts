import {Rectangle, Size} from "./common";

export interface SystemAPI {
    /**
     * Info about all displays available
     */
    displays: () => DisplayInfo[];

    /**
     * Capture
     * @param options
     */
    capture: (options?: CaptureOptions) => Promise<ImageData>;

    /**
     * Capture specific display
     * @param displayId
     * @param options
     */
    captureDisplay: (displayId: number, options?: CaptureOptions) => Promise<ImageData>;

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

    /** Operating system information */
    os: OperatingSystemInfo;
}

export interface DisplayInfo {
    /** Unique identifier associated with the display. */
    id: number;

    /** Can be 0, 90, 180, 270, represents screen rotation in clock-wise degrees. */
    rotation: number;

    /** Output device's pixel scale factor. */
    scaleFactor: number;

    /** True if this is the primary display */
    primary: boolean;

    bounds: Rectangle;
    size: Size;
    workArea: Rectangle;
    workAreaSize: Size;
}

export interface OperatingSystemInfo{
    platform: 'Windows' | 'OSX' | 'Linux';
    version: string;
    is64bit: boolean;
}

export interface CaptureOptions {
    captureSize: Size;
}

export interface WindowImageData {
    windowId: string;
    image: ImageData;
}

export interface ImageData {
    type: string;
    data: string;
}
