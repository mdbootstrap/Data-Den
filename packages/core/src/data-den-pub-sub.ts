import { DataDenPublishedEvent } from './data-den-published-event';
import { DataDenEvent } from './data-den-event';

type DataDenEventCallback = (event: DataDenEvent) => void;

export class DataDenPubSub {
  #listeners: { [key: string]: DataDenEventCallback[] } = {
    'command:pagination:load-first-page:start': [],
    'command:pagination:load-prev-page:start': [],
    'command:pagination:load-next-page:start': [],
    'command:pagination:load-last-page:start': [],
    'command:editing:row-values-changed': [],
    'info:pagination:data-change:done': [],
    'info:pagination:info-change:done': [],
    'info:pagination:page-size-change:done': [],
    'info:dragging:columns-reorder:done': [],
    'command:sorting:start': [],
    'info:filtering:get-active-quick-filter:done': [],
    'info:filtering:header-filter-changed': [],
    'info:filtering:active-filters-changed': [],
    'info:filtering:quick-filter-changed': [],
    'info:filtering:active-quick-filter-changed': [],
    'info:resizing:mousedown': [],
    'info:resizing:mouseup': [],
    'command:resizing:start': [],
    'info:resizing:start': [],
    'info:resizing:done': [],
    'command:fetch:start': [],
    'command:fetch:sort-start': [],
    'info:fetch:done': [],
    'command:pin-column:start': [],
    'command:rerendering:done': [],
  };

  publish(name: string, data: DataDenPublishedEvent) {
    if (!this.#listeners[name]) {
      return;
    }

    const event = new DataDenEvent(name, data, data.context);
    this.#listeners[name].forEach((callback) => {
      callback(event);
    });
  }

  subscribe(name: string, callback: DataDenEventCallback) {
    if (!this.#listeners[name]) {
      throw new Error(`Could not subscribe: Unsupported event: ${name}`);
    }
    this.#listeners[name].push(callback);

    return () => {
      this.#unsubscribe(name, callback);
    };
  }

  #unsubscribe(name: string, callback: DataDenEventCallback) {
    if (!this.#listeners[name]) {
      return;
    }
    this.#listeners[name] = this.#listeners[name].filter((cb) => cb !== callback);
  }
}
