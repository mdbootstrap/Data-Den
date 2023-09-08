import { Order } from './data-den-sorting.interface';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { DataDenEvent } from '../../data-den-event';

export class DataDenSortingService {
  #field: string;
  #order: Order;

  constructor() {
    this.#field = '';
    this.#order = 'asc';

    DataDenPubSub.subscribe('command:sorting:start', (event: DataDenEvent) => {
      const ctx = event.context;

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

      this.#field = event.data.field;
      const rows = this.sort(event.data.rows, this.#field, this.#order);

      DataDenPubSub.publish('info:sorting:done', {
        caller: this,
        context: ctx,
        order: this.#order,
        rows,
      });
    });
  }

  sort(rows: any, field: string, order: string): void {
    if (!order) return rows;

    const sortedData = rows
      .map((row: any[]) => ({ ...row }))
      .sort((a: any, b: any) => {
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
