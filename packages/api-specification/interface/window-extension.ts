declare interface Window {
  /**
   * Create a notification
   * @param title - The title text of the notification.
   * @param options - The notification options.
   */
  Notification(title: string, options: ssf.NotificationOptions): void;
}
