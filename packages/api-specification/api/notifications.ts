/**
 * Currently following HTML5 notification specs
 *
 * Imported from typescript definition files
 * https://github.com/Microsoft/TSJS-lib-generator/blob/cd60588b72a9188e89346b3c440a76508b4c0e76/baselines/dom.generated.d.ts#L8360-L8381
 */
export interface NotificationsAPI {
    permission: NotificationPermission;
    maxActions: number;

    requestPermission(): Promise<NotificationPermission>;
}

export type NotificationPermission = "default" | "denied" | "granted";

export type NotificationDirection = "auto" | "ltr" | "rtl";

export interface NotificationPermissionCallback {
    (permission: NotificationPermission): void;
}

export interface NotificationOptions {
    dir?: NotificationDirection;
    lang?: string;
    body?: string;
    tag?: string;
    image?: string;
    icon?: string;
    badge?: string;
    sound?: string;
    vibrate?: number | number[],
    timestamp?: number,
    renotify?: boolean;
    silent?: boolean;
    requireInteraction?: boolean;
    data?: any;
    actions?: NotificationAction[]
}

export interface NotificationAction {
    action: string;
    title: string;
    icon?: string;
}

declare class Notification extends EventTarget {
    constructor(title: string, options?: NotificationOptions);

    onclick: EventListenerOrEventListenerObject;
    onerror: EventListenerOrEventListenerObject;

    close(): void;

    readonly title: string;
    readonly dir: NotificationDirection;
    readonly lang: string;
    readonly body: string;
    readonly tag: string;
    readonly image: string;
    readonly icon: string;
    readonly badge: string;
    readonly sound: string;
    readonly vibrate: number[];
    readonly timestamp: number;
    readonly renotify: boolean;
    readonly silent: boolean;
    readonly requireInteraction: boolean;
    readonly data: any;
    readonly actions: NotificationAction[]
}