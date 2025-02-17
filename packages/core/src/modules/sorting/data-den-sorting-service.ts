import { DataDenSortOrder } from './data-den-sorting.interface';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { DataDenEvent } from '../../data-den-event';
import { DataDenEventEmitter } from '../../data-den-event-emitter';
import { DataDenSortingPreviousState } from './data-den-sorting-previous-state';
import { DataDenInternalOptions, DataDenSortComparator } from '../../data-den-options.interface';
import { Context } from '../../context';

export interface DataDenActiveSorter {
  field: string;
  order: DataDenSortOrder;
  comparator: DataDenSortComparator;
  sortIndex: number;
}

export class DataDenSortingService {
  #field: string;
  #order: DataDenSortOrder;
  #options: DataDenInternalOptions;
  activeSortersMap: Map<string, DataDenActiveSorter>;
  #sortOptions: (string | null)[];

  constructor(options: DataDenInternalOptions, private PubSub: DataDenPubSub) {
    this.#field = '';
    this.#order = null;
    this.#options = options;

    this.activeSortersMap = new Map();

    this.PubSub.subscribe('command:sorting:start', (event: DataDenEvent) => {
      this.#sortOptions = options.columns.find((x) => x.field === event.data.field).sortOrder;
      const sortingPreviousState = new DataDenSortingPreviousState({ field: this.#field, order: this.#order });

      const { field, isMultiSort } = event.data;
      const isCurrentSorterActive = this.activeSortersMap.has(field);
      const currentSorterOrder = isCurrentSorterActive ? this.activeSortersMap.get(field).order : null;

      let order: DataDenSortOrder;

      if (event.data.order) {
        order = event.data.order;
      } else {
        const currentSorterOrderIdx = this.#sortOptions.indexOf(currentSorterOrder);
        order = this.#sortOptions[(currentSorterOrderIdx + 1) % this.#sortOptions.length] as DataDenSortOrder;
      }

      this.#field = event.data.field;
      const colDef = this.#options.columns.find((column) => column.field === this.#field);
      const comparator = colDef.sortOptions.comparator;

      const sortingStartEvent = DataDenEventEmitter.triggerEvent('sortingStart', {
        field: field,
        order: order,
        comparator,
        sortFn: this.sort,
      });

      if (sortingStartEvent.defaultPrevented) {
        this.#field = sortingPreviousState.getValue('field');
        this.#order = sortingPreviousState.getValue('order');
        return;
      }

      if (isMultiSort) {
        this.updateActiveSortersMap(field, order, comparator);
      } else {
        this.activeSortersMap.clear();
        this.updateActiveSortersMap(field, order, comparator);
      }

      this.PubSub.publish('command:fetch:sort-start', {
        caller: this,
        context: event.context,
        field: field,
        order: order,
        comparator,
        sortFn: this.sort,
        activeSorters: this.getActiveSortersArray(),
        isMultiSort,
      });
    });

    this.#setColumnDefaultSort(options);
  }

  #setColumnDefaultSort(options: DataDenInternalOptions) {
    this.#options.columns.forEach((colDef) => {
      const order = colDef.defaultSort;

      if (order && colDef.sortOrder.includes(order)) {
        this.PubSub.publish('command:sorting:start', {
          caller: this,
          context: new Context('command:sorting:start'),
          field: colDef.field,
          order: order,
          multiSort: options.multiSort,
        });
      }
    });
  }

  updateActiveSortersMap(field: string, order: DataDenSortOrder, comparator: DataDenSortComparator) {
    const sorterExist = this.activeSortersMap.has(field);

    if (order === null && sorterExist) {
      this.activeSortersMap.delete(field);
      this.updateSortIndexes();
      return;
    }

    if (sorterExist && order !== null) {
      const sort = this.activeSortersMap.get(field);
      sort.order = order;
    } else if (!sorterExist && order !== null) {
      const sortIndex = this.activeSortersMap.size;
      this.activeSortersMap.set(this.#field, { field, order, comparator, sortIndex });
    }
  }

  updateSortIndexes() {
    let currentIndex = 0;

    for (const sorter of this.activeSortersMap.values()) {
      sorter.sortIndex = currentIndex++;
    }
  }

  getActiveSortersArray(): DataDenActiveSorter[] {
    return Array.from(this.activeSortersMap.values()).sort((a, b) => a.sortIndex - b.sortIndex);
  }

  sort(rows: any, activeSorters: DataDenActiveSorter[]): any[] {
    rows.sort((a: any, b: any) => {
      let sortResult = 0;

      for (const sorter of activeSorters) {
        const { order, field, comparator } = sorter;

        if (sortResult === 0) {
          const isAscending = order === 'asc';
          const fieldA = a[field];
          const fieldB = b[field];

          const result = comparator(fieldA, fieldB);

          sortResult = isAscending ? result : result * -1;
        } else {
          break;
        }
      }

      return sortResult;
    });

    return rows;
  }
}
