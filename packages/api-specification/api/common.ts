// contains common types
export interface Bounds {
    top: number;
    left: number;
    width: number;
    height: number;
}

export interface Size{
    width: number;
    height: number;
}

/**
 * Function returned from event subscription functions (e.g. onWindowBoundsChanged).
 * Executing it will remove the event handler.
 */
export interface UnsubscribeFunction {
    (): void;
}