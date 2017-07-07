declare namespace ssf {
  /**
   * Exposes methods that allow subscribing to particular events
   */
  abstract class EventEmitter {
    /**
     * Adds a listener that runs when the specified event occurs. Alias for <span class="code-small">on()</span>.
     * @param event The event to listen for.
     * @param listener The function to run when the event occurs.
     */
    addListener(event: string, listener: Function): EventEmitter;

    /**
     * Adds a listener that runs when the specified event occurs. Alias for <span class="code-small">addListener()</span>.
     * @param event The event to listen for.
     * @param listener The function to run when the event occurs.
     */
    on(event: string, listener: Function): EventEmitter;

    /**
     * Adds a listener that runs once when the specified event occurs, then is removed.
     * @param event The event to listen for.
     * @param listener The function to run once when the event occurs.
     */
    once(event: string, listener: Function): EventEmitter;

    /**
     * Get all event names with active listeners.
     */
    eventNames(): Array<string|symbol>;

    /**
     * Get the number of listeners currently listening for an event.
     * @param event The event to get the number of listeners for.
     */
    listenerCount(event: string): number;

    /**
     * Get all listeners for an event.
     * @param event The event to get the listeners for.
     */
    listeners(event: string): Array<Function>;

    /**
     * Remove a listener from an event.
     * @param event The event to remove the listener from.
     * @param listener The listener to remove. Must be the same object that was passed to <span class="code-small">addListener()</span>
     */
    removeListener(event: string, listener: Function): EventEmitter;

    /**
     * Removes all listeners from a given event, or all events if no event is passed.
     * @param event The event to remove the listeners from.
     */
    removeAllListeners(event?: string): EventEmitter;
  }
}
