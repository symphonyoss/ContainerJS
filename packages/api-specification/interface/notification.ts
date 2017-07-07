declare namespace ssf {
  class NotificationOptions {
    /**
     * The text to display underneath the title text.
     */
    body?: string;
  }
  type NotificationPermission = "default" | "denied" | "granted";

  class Notification {
    /**
     * Create a notification
     * @param title - The title text of the notification.
     * @param options - The notification options.
     */
    constructor(title: string, options: NotificationOptions);

    static requestPermission(): Promise<NotificationPermission>;
  }
}
