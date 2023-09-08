import { DataDenPublishedEvent } from './data-den-published-event';
import { DataDenEvent } from './data-den-event';

type DataDenEventCallback = (event: DataDenEvent) => void;

export class DataDenPubSub {
  static #listeners: { [key: string]: DataDenEventCallback[] } = {
    'command:sorting:start': [],
    'info:sorting:done': [],
    'info:filtering:header-filter-changed': [],
    'info:filtering:active-filters-changed': [],
  };

  static publish(name: string, data: DataDenPublishedEvent) {
    if (!this.#listeners[name]) {
      return;
    }

    const event = new DataDenEvent(name, data, data.context);
    this.#listeners[name].forEach((callback) => {
      callback(event);
    });
  }

  static subscribe(name: string, callback: DataDenEventCallback) {
    if (!this.#listeners[name]) {
      throw new Error(`Could not subscribe: Unsupported event: ${name}`);
    }
    this.#listeners[name].push(callback);

    return () => {
      this.#unsubscribe(name, callback);
    };
  }

  static #unsubscribe(name: string, callback: DataDenEventCallback) {
    if (!this.#listeners[name]) {
      return;
    }
    this.#listeners[name] = this.#listeners[name].filter((cb) => cb !== callback);
  }
}
