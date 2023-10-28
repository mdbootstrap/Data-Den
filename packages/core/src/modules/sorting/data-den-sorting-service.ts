import { Order } from './data-den-sorting.interface';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { DataDenEvent } from '../../data-den-event';
import { DataDenEventEmitter } from '../../data-den-event-emitter';
import { DataDenStorage } from '../../modules/storage/DataDenStorage';

export class DataDenSortingService {
  #field: string;
  #order: Order;

  constructor() {
    this.#field = '';
    this.#order = 'asc';

    DataDenPubSub.subscribe('command:sorting:start', (event: DataDenEvent) => {
      const sortingStorage = new DataDenStorage({ field: this.#field, order: this.#order });

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

      const sortingStartEvent = DataDenEventEmitter.triggerEvent('sortingStart', {
        field: this.#field,
        order: this.#order,
        sortFn: this.sort,
      });

      if (sortingStartEvent.defaultPrevented) {
        this.#field = sortingStorage.getValue('field');
        this.#order = sortingStorage.getValue('order');
        return;
      }

      DataDenPubSub.publish('command:fetch:sort-start', {
        caller: this,
        context: event.context,
        field: this.#field,
        order: this.#order,
        sortFn: this.sort,
      });
    });
  }

  sort(rows: any, field: string, order: string): any[] {
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
