import { Context } from '../../context';
import { DataDenEvent } from '../../data-den-event';
import { DataDenQuickFilterOptions } from '../../data-den-options.interface';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { DataDenActiveFiltersChangeEvent } from './data-den-active-filter-change-event.interface';
import { DataDenActiveHeaderFilter } from './data-den-active-header-filter.interface';
import { DataDenActiveQuickFilterChangeEvent } from './data-den-active-quick-filter-change-event.interface';
import { DataDenActiveQuickFilter } from './data-den-active-quick-filter.interface';

export class DataDenFilteringService {
  activeHeaderFilters: { [key: string]: DataDenActiveHeaderFilter } = {};
  activeQuickFilter: DataDenActiveQuickFilter;

  constructor(options: DataDenQuickFilterOptions) {
    this.activeQuickFilter = { searchTerm: '', filterFn: this.#getQuickFilterFn(options) };

    DataDenPubSub.subscribe('info:filtering:header-filter-changed', this.#handleHeaderFilterChange.bind(this));
    DataDenPubSub.subscribe('info:filtering:quick-filter-changed', this.#handleQuickFilterChange.bind(this));
  }

  #getQuickFilterFn(options: DataDenQuickFilterOptions): (searchTerm: any, value: any) => boolean {
    if (options.filterFn) {
      return options.filterFn;
    } else {
      return (searchTerm: any, value: any) => {
        searchTerm = searchTerm.toLowerCase();
        value = value.toString().toLowerCase();

        return value.includes(searchTerm);
      };
    }
  }

  #handleHeaderFilterChange(event: DataDenEvent) {
    const { field, type, method, searchTerm, caseSensitive } = event.data;
    const filterFn = this.#getFilterFunction(type, method, caseSensitive);
    const filter: DataDenActiveHeaderFilter = { type, method, searchTerm, caseSensitive, filterFn };

    this.#updateActiveHeaderFilters(field, filter);

    const activeFiltersChangeEvent: DataDenActiveFiltersChangeEvent = {
      context: new Context('info:filtering:active-filters-changed'),
      filters: this.activeHeaderFilters,
    };

    DataDenPubSub.publish('info:filtering:active-filters-changed', activeFiltersChangeEvent);
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
      value = caseSensitive ? value : value.toString().toLowerCase();
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

  #handleQuickFilterChange(event: DataDenEvent) {
    const { searchTerm } = event.data;

    this.activeQuickFilter.searchTerm = searchTerm;

    const activeQuickFilterChangeEvent: DataDenActiveQuickFilterChangeEvent = {
      context: new Context('info:filtering:active-quick-filter-changed'),
      filter: this.activeQuickFilter,
    };

    DataDenPubSub.publish('info:filtering:active-quick-filter-changed', activeQuickFilterChangeEvent);
  }
}
