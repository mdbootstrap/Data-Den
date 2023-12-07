import { Context } from '../../context';
import { DataDenEvent } from '../../data-den-event';
import { DataDenInternalOptions } from '../../data-den-options.interface';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { DataDenActiveFiltersChangeEvent } from './data-den-active-filter-change-event.interface';
import { DataDenActiveHeaderFilter } from './data-den-active-header-filter.interface';
import { DataDenActiveQuickFilterChangeEvent } from './data-den-active-quick-filter-change-event.interface';
import { DataDenActiveQuickFilter } from './data-den-active-quick-filter.interface';

export class DataDenFilteringService {
  activeHeaderFilters: { [key: string]: DataDenActiveHeaderFilter } = {};
  activeQuickFilter: DataDenActiveQuickFilter;
  options: DataDenInternalOptions;
  private PubSub: DataDenPubSub;

  constructor(options: DataDenInternalOptions) {
    this.options = options;
    this.activeQuickFilter = { searchTerm: '', filterFn: options.quickFilterOptions.filterFn };

    this.PubSub.subscribe('info:filtering:header-filter-changed', this.#handleHeaderFilterChange.bind(this));
    this.PubSub.subscribe('info:filtering:quick-filter-changed', this.#handleQuickFilterChange.bind(this));
  }

  #handleHeaderFilterChange(event: DataDenEvent) {
    const { field, type, state, isActive, filterFn } = event.data;
    const filter: DataDenActiveHeaderFilter = { type, state, filterFn };

    this.#updateActiveHeaderFilters(field, filter, isActive);

    const activeFiltersChangeEvent: DataDenActiveFiltersChangeEvent = {
      context: new Context('info:filtering:active-filters-changed'),
      filters: this.activeHeaderFilters,
    };

    this.PubSub.publish('info:filtering:active-filters-changed', activeFiltersChangeEvent);
  }

  #updateActiveHeaderFilters(field: string, filter: DataDenActiveHeaderFilter, isActive: boolean) {
    if (isActive) {
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

    this.PubSub.publish('info:filtering:active-quick-filter-changed', activeQuickFilterChangeEvent);
  }
}
