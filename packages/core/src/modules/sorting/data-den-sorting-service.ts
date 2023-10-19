import { Order } from './data-den-sorting.interface';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { DataDenEvent } from '../../data-den-event';
import { DataDenRowDef } from '../../data-den-options.interface';
import { DataDenEventEmitter } from '../../data-den-event-emitter';
import { Context } from '../../context';

export class DataDenSortingService {
  #container: HTMLElement;
  #field: string;
  #order: Order;

  constructor(container: HTMLElement) {
    this.#container = container;
    this.#field = '';
    this.#order = 'asc';

    DataDenPubSub.subscribe('command:sorting:start', (event: DataDenEvent) => {
      if (this.#field === event.data.field) {
        switch (this.#order) {
          case 'asc':
            this.#order = 'desc';
            break;
          case 'desc':
            this.#order = '';
            break;
          default:
            this.#order = 'asc';
            break;
        }
      } else {
        this.#order = 'asc';
      }

      if (event.data.order) {
        this.#order = event.data.order;
      }

      this.#field = event.data.field;

      DataDenPubSub.publish('command:fetch:sort-start', {
        caller: this,
        context: event.context,
        field: this.#field,
        order: this.#order,
        sortFn: this.sort,
      });

      DataDenEventEmitter.publish('sorting.done', {
        element: this.#container,
        context: new Context('sorting.done'),
        field: this.#field,
        order: this.#order,
        sortFn: this.sort,
      });
    });
  }

  sort(rows: DataDenRowDef[], field: string, order: string): DataDenRowDef[] {
    if (!order) return rows;

    const sortedData = rows.sort((a: any, b: any) => {
      let fieldA = a[field];
      let fieldB = b[field];

      if (typeof fieldA === 'string') {
        fieldA = fieldA.toLowerCase();
      }
      if (typeof fieldB === 'string') {
        fieldB = fieldB.toLowerCase();
      }

      if (fieldA < fieldB) {
        return order === 'desc' ? 1 : -1;
      }
      if (fieldA > fieldB) {
        return order === 'desc' ? -1 : 1;
      }
      return 0;
    });

    return sortedData;
  }
}
