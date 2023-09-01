import { DataDenPublishedEvent } from './data-den-published-event';
import { DataDenEvent } from './data-den-event';

export class DataDenPubSub {
  static #listeners: { [key: string]: any[] } = {
    'command:pagination:info-changed': [],
    'command:pagination:data-changed': [],
    'command:pagination:load-first-page': [],
    'command:pagination:load-prev-page': [],
    'command:pagination:load-next-page': [],
    'command:pagination:load-last-page': [],
    'command:pagination:page-size-changed': [],
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

  static subscribe(name: string, callback: any) {
    if (!this.#listeners[name]) {
      throw new Error(`Could not subscribe: Unsupported event: ${name}`);
    }
    this.#listeners[name].push(callback);

    return () => {
      this.#unsubscribe(name, callback);
    };
  }

  static #unsubscribe(name: string, callback: any) {
    if (!this.#listeners[name]) {
      return;
    }
    this.#listeners[name] = this.#listeners[name].filter((cb) => cb !== callback);
  }
}
