import { Context } from '../../context';
import { DataDenEvent } from '../../data-den-event';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { DataDenActiveFiltersChangeEvent } from './data-den-active-filter-change-event.interface';
import { DataDenActiveHeaderFilter } from './data-den-active-header-filter.interface';

export class DataDenFilteringService {
  activeHeaderFilters: { [key: string]: DataDenActiveHeaderFilter } = {};

  constructor() {
    DataDenPubSub.subscribe('notification:filtering:header-filter-changed', this.#handleHeaderFilterChange.bind(this));
  }

  #handleHeaderFilterChange(event: DataDenEvent) {
    const { field, type, method, searchTerm, caseSensitive } = event.data;
    const filterFn = this.#getFilterFunction(type, method, caseSensitive);
    const filter: DataDenActiveHeaderFilter = { type, method, searchTerm, caseSensitive, filterFn };

    this.#updateActiveHeaderFilters(field, filter);

    const activeFiltersChangeEvent: DataDenActiveFiltersChangeEvent = {
      context: new Context('notification:filtering:active-filters-changed'),
      filters: this.activeHeaderFilters,
    };

    DataDenPubSub.publish('notification:filtering:active-filters-changed', activeFiltersChangeEvent);
  }

  #getFilterFunction(type: string, method: string, caseSensitive: boolean) {
    switch (type) {
      case 'text':
        return this.#getTextFilterFunction(method, caseSensitive);
      default:
        return () => false;
    }
  }

  #getTextFilterFunction(method: string, caseSensitive: boolean) {
    return (searchTerm: string, value: any) => {
      value = caseSensitive ? value : value.toLowerCase();
      searchTerm = caseSensitive ? searchTerm : searchTerm.toLowerCase();

      switch (method) {
        case 'includes':
          return value.includes(searchTerm);
        default:
          return false;
      }
    };
  }

  #updateActiveHeaderFilters(field: string, filter: DataDenActiveHeaderFilter) {
    if (filter.searchTerm) {
      this.activeHeaderFilters[field] = filter;
    } else {
      delete this.activeHeaderFilters[field];
    }
  }
}
