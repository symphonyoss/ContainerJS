export abstract class Emitter implements ssf.EventEmitter {
  eventListeners: Map<string, ((...args: any[]) => void)[]> = new Map();

  constructor() {
    this.eventListeners = new Map();
  }

  innerAddEventListener(event: string, listener: (...args: any[]) => void) {
    // No-op default implementation to be overridden if required
  }
  innerRemoveEventListener(event: string, listener: (...args: any[]) => void) {
    // No-op default implementation to be overridden if required
  }

  emit(event: string, data?: any) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(listener => listener(data));
    }
  }

  addListener(event: string, listener: (...args: any[]) => void) {
    if (this.eventListeners.has(event)) {
      const temp = this.eventListeners.get(event);
      temp.push(listener);
      this.eventListeners.set(event, temp);
    } else {
      this.eventListeners.set(event, [listener]);
    }
    this.innerAddEventListener(event, listener);
    return this;
  }

  on(event: string, listener: (...args: any[]) => void) {
    return this.addListener(event, listener);
  }

  eventNames() {
    return Array.from<string>(this.eventListeners.keys());
  }

  listenerCount(event: string) {
    return this.eventListeners.has(event) ? this.eventListeners.get(event).length : 0;
  }

  listeners(event: string) {
    return this.eventListeners.get(event);
  }

  once(event: string, listener: (...args: any[]) => void) {
    // Remove the listener once it is called
    const unsubscribeListener = (evt) => {
      this.removeListener(event, unsubscribeListener);
      listener(evt);
    };

    this.on(event, unsubscribeListener);
    return this;
  }

  removeListener(event: string, listener: (...args: any[]) => void) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(listener);
      if (index >= 0) {
        listeners.splice(index, 1);
        listeners.length > 0
          ? this.eventListeners.set(event, listeners)
          : this.eventListeners.delete(event);
      }
    }

    this.innerRemoveEventListener(event, listener);
    return this;
  }

  removeAllListeners(eventName?: string) {
    const removeAllListenersForEvent = (event) => {
      if (this.eventListeners.has(event)) {
        this.eventListeners.get(event).forEach((listener) => {
          this.innerRemoveEventListener(event, listener);
        });
        this.eventListeners.delete(event);
      }
    };

    if (eventName) {
      removeAllListenersForEvent(eventName);
    } else {
      this.eventListeners.forEach((value, key) => removeAllListenersForEvent(key));
    }

    return this;
  }
}
