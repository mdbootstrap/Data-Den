import { DataDenSortOrder } from './data-den-sorting.interface';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { DataDenEvent } from '../../data-den-event';
import { DataDenEventEmitter } from '../../data-den-event-emitter';
import { DataDenSortingPreviousState } from './data-den-sorting-previous-state';
import { DataDenInternalOptions, DataDenSortComparator } from '../../data-den-options.interface';

export class DataDenSortingService {
  #field: string;
  private PubSub: DataDenPubSub;
  #order: DataDenSortOrder;
  #options: DataDenInternalOptions;

  constructor(options: DataDenInternalOptions) {
    this.#field = '';
    this.#order = 'asc';
    this.#options = options;

    this.PubSub.subscribe('command:sorting:start', (event: DataDenEvent) => {
      const sortingPreviousState = new DataDenSortingPreviousState({ field: this.#field, order: this.#order });

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
      const colDef = this.#options.columns.find((column) => column.field === this.#field);
      const comparator = colDef.sortOptions.comparator;

      const sortingStartEvent = DataDenEventEmitter.triggerEvent('sortingStart', {
        field: this.#field,
        order: this.#order,
        comparator,
        sortFn: this.sort,
      });

      if (sortingStartEvent.defaultPrevented) {
        this.#field = sortingPreviousState.getValue('field');
        this.#order = sortingPreviousState.getValue('order');
        return;
      }

      this.PubSub.publish('command:fetch:sort-start', {
        caller: this,
        context: event.context,
        field: this.#field,
        order: this.#order,
        comparator,
        sortFn: this.sort,
      });
    });
  }

  sort(rows: any, field: string, order: DataDenSortOrder, comparator: DataDenSortComparator): any[] {
    if (!order) return rows;

    const sortedData = rows.sort((a: any, b: any) => {
      const isAscending = order === 'asc';
      const fieldA = a[field];
      const fieldB = b[field];

      const result = comparator(fieldA, fieldB);

      return isAscending ? result : result * -1;
    });

    return sortedData;
  }
}
