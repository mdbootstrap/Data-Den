import { DataDenPublishedEvent } from './data-den-published-event';
import { DataDenEvent } from './data-den-event';

type DataDenEventCallback = (event: DataDenEvent) => void;

export class DataDenPubSub {
  static #listeners: { [key: string]: any[] } = {
    'command:pagination:load-first-page:start': [],
    'command:pagination:load-prev-page:start': [],
    'command:pagination:load-next-page:start': [],
    'command:pagination:load-last-page:start': [],
    'notification:pagination:info-change:done': [],
    'notification:pagination:data-change:done': [],
    'notification:pagination:page-size-change:done': [],
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
