import { Context } from '../../context';
import { DataDenEvent } from '../../data-den-event';
import {
  DataDenDateFilterOptions,
  DataDenHeaderFilterOptions,
  DataDenOptions,
  DataDenQuickFilterOptions,
  DataDenTextFilterOptions,
} from '../../data-den-options.interface';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { isSameDate, parseDate } from '../../utils';
import { DataDenActiveFiltersChangeEvent } from './data-den-active-filter-change-event.interface';
import { DataDenActiveHeaderFilter } from './data-den-active-header-filter.interface';
import { DataDenActiveQuickFilterChangeEvent } from './data-den-active-quick-filter-change-event.interface';
import { DataDenActiveQuickFilter } from './data-den-active-quick-filter.interface';

export class DataDenFilteringService {
  activeHeaderFilters: { [key: string]: DataDenActiveHeaderFilter } = {};
  activeQuickFilter: DataDenActiveQuickFilter;
  options: DataDenOptions;

  constructor(options: DataDenOptions) {
    this.options = options;
    this.activeQuickFilter = { searchTerm: '', filterFn: this.#getQuickFilterFn(options.quickFilterOptions) };

    DataDenPubSub.subscribe('info:filtering:header-filter-changed', this.#handleHeaderFilterChange.bind(this));
    DataDenPubSub.subscribe('info:filtering:quick-filter-changed', this.#handleQuickFilterChange.bind(this));
  }

  #getQuickFilterFn(options: DataDenQuickFilterOptions): (searchTerm: any, value: any) => boolean {
    if (options.filterFn) {
      return options.filterFn;
    } else {
      return (searchTerm: any, value: any) => {
        searchTerm = searchTerm.toString().toLowerCase();
        value = value.toString().toLowerCase();

        return value.includes(searchTerm);
      };
    }
  }

  #handleHeaderFilterChange(event: DataDenEvent) {
    const { field, method, searchTerm } = event.data;
    const column = this.options.columns.find((column) => column.field === field)!;
    const options = column.filterOptions;
    const type = options.type;
    const filterFn = this.#getFilterFunction(type, method, options);
    const filter: DataDenActiveHeaderFilter = { type, method, searchTerm, filterFn };

    this.#updateActiveHeaderFilters(field, filter);

    const activeFiltersChangeEvent: DataDenActiveFiltersChangeEvent = {
      context: new Context('info:filtering:active-filters-changed'),
      filters: this.activeHeaderFilters,
    };

    DataDenPubSub.publish('info:filtering:active-filters-changed', activeFiltersChangeEvent);
  }

  #getFilterFunction(type: string, method: string, options: DataDenHeaderFilterOptions) {
    switch (type) {
      case 'text':
        return this.#getTextFilterFunction(method, options as DataDenTextFilterOptions);
      case 'number':
        return this.#getNumberFilterFunction(method);
      case 'date':
        return this.#getDateFilterFunction(method, options as DataDenDateFilterOptions);
      default:
        return () => false;
    }
  }

  #getTextFilterFunction(method: string, options: DataDenTextFilterOptions) {
    return (searchTerm: string, value: any) => {
      const caseSensitive = options.caseSensitive;
      value = caseSensitive ? value : value.toString().toLowerCase();
      searchTerm = caseSensitive ? searchTerm : searchTerm.toString().toLowerCase();

      switch (method) {
        case 'includes':
          return value.includes(searchTerm);
        default:
          return false;
      }
    };
  }

  #getNumberFilterFunction(method: string) {
    return (searchTerm: string, value: any) => {
      const searchTermAsNumber = Number(searchTerm);
      const valueAsNumber = Number(value);

      switch (method) {
        case 'equals':
          return valueAsNumber === searchTermAsNumber;
        default:
          return false;
      }
    };
  }

  #getDateFilterFunction(method: string, options: DataDenDateFilterOptions) {
    return (searchTerm: string, value: any) => {
      const dateParserFn = options.dateParserFn;
      const searchTermAsDate = parseDate(searchTerm);
      const valueAsDate = typeof value === 'string' ? dateParserFn(value) : value;

      switch (method) {
        case 'equals':
          return isSameDate(searchTermAsDate, valueAsDate);
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
