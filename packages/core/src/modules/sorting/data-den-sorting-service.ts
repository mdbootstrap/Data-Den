import { Order } from './data-den-sorting.interface';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { DataDenEvent } from '../../data-den-event';
import { DataDenEventEmitter } from '../../data-den-event-emitter';
import { DataDenSortingPreviousState } from './data-den-sorting-previous-state';

export class DataDenSortingService {
  #field: string;
  #order: Order;
  #sortingMethods: { id: string; method: string }[];

  constructor() {
    this.#field = '';
    this.#order = 'asc';
    this.#sortingMethods = [];

    const sortingSelect = document.querySelectorAll('.sortingSelect');
    sortingSelect.forEach((select: HTMLSelectElement) => {
      select.addEventListener('change', () => {
        const isMethod = this.#sortingMethods.some((sortingMethod) => sortingMethod.id === select.getAttribute('id'));
        if (!isMethod) {
          this.#sortingMethods.push({ id: select.getAttribute('id'), method: select.value });
        } else {
          const methodIndex = this.#sortingMethods.findIndex(
            (sortingMethod) => sortingMethod.id === select.getAttribute('id')
          );
          this.#sortingMethods[methodIndex].method = select.value;
        }
      });
    });

    DataDenPubSub.subscribe('command:sorting:start', (event: DataDenEvent) => {
      const sortingPreviousState = new DataDenSortingPreviousState({ field: this.#field, order: this.#order });
      const isMethod = this.#sortingMethods.some((sortingMethod) => sortingMethod.id === event.data.field);
      if (isMethod === false) this.#sortingMethods.push({ id: event.data.field, method: 'asc-desc' });
      const methodIndex = this.#sortingMethods.findIndex((sortingMethod) => sortingMethod.id === event.data.field);

      if (methodIndex !== -1 && this.#sortingMethods[methodIndex].method === 'asc-desc') {
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
      } else if (methodIndex !== -1 && this.#sortingMethods[methodIndex].method === 'desc-asc') {
        if (this.#field === event.data.field) {
          switch (this.#order) {
            case 'desc':
              this.#order = 'asc';
              break;
            case 'asc':
              this.#order = '';
              break;
            default:
              this.#order = 'desc';
              break;
          }
        } else {
          this.#order = 'desc';
        }
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
        this.#field = sortingPreviousState.getValue('field');
        this.#order = sortingPreviousState.getValue('order');
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
