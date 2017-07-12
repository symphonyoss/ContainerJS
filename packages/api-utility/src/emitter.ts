abstract class Emitter implements ssf.EventEmitter {
  eventListeners: Map<string, ((...args: any[]) => void)[]> = new Map();

  constructor() {
    this.eventListeners = new Map();
  }

  abstract innerAddEventListener(event: string, listener: (...args: any[]) => void);
  abstract innerRemoveEventListener(event: string, listener: (...args: any[]) => void);

  emit(event: string, data?: any) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(listener => listener(data));
    }
  }

  addListener(event, listener) {
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

  on(event, listener) {
    return this.addListener(event, listener);
  }

  eventNames() {
    return Array.from<string>(this.eventListeners.keys());
  }

  listenerCount(event) {
    return this.eventListeners.has(event) ? this.eventListeners.get(event).length : 0;
  }

  listeners(event) {
    return this.eventListeners.get(event);
  }

  once(event, listener) {
    // Remove the listener once it is called
    const unsubscribeListener = (evt) => {
      this.removeListener(event, unsubscribeListener);
      listener(evt);
    };

    this.on(event, unsubscribeListener);
    return this;
  }

  removeListener(event, listener) {
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

  removeAllListeners(eventName) {
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

export default Emitter;
