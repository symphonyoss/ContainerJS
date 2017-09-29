declare namespace ssf {
  /**
   * Exposes methods that allow subscribing to particular events
   *
   * <i>EventEmitter is the base class for event emitting objects,
   * such as <a href="#Window">Window</a>.</i>
   *
   * <pre>
   * ssf.Window.getCurrentWindow().on('focus', () => {
   *  console.log('Window received focus');
   * });
   * </pre>
   */
  abstract class EventEmitter {
    /**
     * Adds a listener that runs when the specified event occurs. Alias for <span class="code-small">on()</span>.
     *
     * <pre>
     * window.addListener('blur', () => {
     *   console.log('blurred');
     * });
     * </pre>
     *
     * @param event The event to listen for.
     * @param listener The function to run when the event occurs.
     */
    addListener(event: string, listener: Function): EventEmitter;

    /**
     * Adds a listener that runs when the specified event occurs. Alias for <span class="code-small">addListener()</span>.
     *
     * <pre>
     * window.on('blur', () => {
     *   console.log('blurred');
     * });
     * </pre>
     *
     * @param event The event to listen for.
     * @param listener The function to run when the event occurs.
     */
    on(event: string, listener: Function): EventEmitter;

    /**
     * Adds a listener that runs once when the specified event occurs, then is removed.
     *
     * <pre>
     * window.once('show', () => {
     *   console.log('shown');
     * });
     * </pre>
     *
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
     * Remove a listener from an event. <i>Note: this must be the same function object.</i>
     *
     * <pre>
     * const listener = () => {
     *   console.log('blurred');
     * };
     * window.addListener('blur', listener);
     *
     * //...
     *
     * window.removeListener('blur', listener);
     * </pre>
     *
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
