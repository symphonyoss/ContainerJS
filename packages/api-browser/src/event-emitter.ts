abstract class EventEmitter implements ssf.EventEmitter {
  eventListeners: Map<string, ((...args: any[]) => void)[]> = new Map();
  eventMap: any;

  constructor(eventMap: any) {
    this.eventListeners = new Map();
    this.eventMap = eventMap;
  }

  abstract innerAddEventListener(eventName: string, handler: (...args: any[]) => void);
  abstract innerRemoveEventListener(eventName: string, handler: (...args: any[]) => void);

  addListener(event, listener) {
    if (this.eventListeners.has(event)) {
      const temp = this.eventListeners.get(event);
      temp.push(listener);
      this.eventListeners.set(event, temp);
    } else {
      this.eventListeners.set(event, [listener]);
    }
    this.innerAddEventListener(this.eventMap[event], listener);
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
      let listeners = this.eventListeners.get(event);
      let index = listeners.indexOf(listener);
      if (index >= 0) {
        listeners.splice(index, 1);
        listeners.length > 0
          ? this.eventListeners.set(event, listeners)
          : this.eventListeners.delete(event);
      }
    }

    this.innerRemoveEventListener(this.eventMap[event], listener);
    return this;
  }

  removeAllListeners(eventName) {
    const removeAllListenersForEvent = (event) => {
      if (this.eventListeners.has(event)) {
        this.eventListeners.get(event).forEach((listener) => {
          this.innerRemoveEventListener(this.eventMap[event], listener);
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

export default EventEmitter;
