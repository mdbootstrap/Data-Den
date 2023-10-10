import { Context } from '../../context';
import { DataDenEvent } from '../../data-den-event';
import { DataDenOptions } from '../../data-den-options.interface';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { DataDenFetchDoneEvent } from './data-den-fetch-done.event.interface';
import { DataDenFetchOptions } from './data-den-fetch-options.interface';
import { DataDenData } from '../../data-den-data.interface';
import { DataDenDataLoaderStrategy } from './strategy/data-den-data-loader-strategy';

export class DataDenFetchService {
  #loader: DataDenDataLoaderStrategy;
  #fetchOptions: DataDenFetchOptions;

  constructor(private options: DataDenOptions) {
    this.#loader = this.options.dataLoader;
    this.#fetchOptions = {};
    this.#subscribeFetchStart();
    this.#subscribeSortingDone();
    this.#subscribeQuickFilterChanged();
    this.#subscribeFilterChange();
    this.#subscribePaginationChange();
  }

  #getData(fetchOptions: DataDenFetchOptions): Promise<DataDenData> {
    return this.#loader.getData(fetchOptions);
  }

  #publishFetchDone(context: Context, data: any): void {
    const EventData: DataDenFetchDoneEvent = {
      caller: this,
      context,
      rows: data.rows,
      columns: data.columns,
    };
    DataDenPubSub.publish('info:fetch:done', EventData);
  }

  #subscribeFetchStart(): void {
    DataDenPubSub.subscribe('command:fetch:start', (event: DataDenEvent) => {
      this.#getData(this.#fetchOptions).then((data: DataDenData) => {
        this.#publishFetchDone(event.context, data);
      });
    });
  }

  #subscribeSortingDone(): void {
    DataDenPubSub.subscribe('command:fetch:sort-start', (event: DataDenEvent) => {
      this.#fetchOptions.sortingOptions = {
        field: event.data.field,
        order: event.data.order,
        sortFn: event.data.sortFn,
      };
      this.#getData(this.#fetchOptions).then((data: DataDenData) => {
        this.#publishFetchDone(event.context, {
          ...data,
          order: this.#fetchOptions.sortingOptions?.order,
        });
      });
    });
  }

  #subscribeQuickFilterChanged(): void {
    DataDenPubSub.subscribe('info:filtering:active-quick-filter-changed', (event: DataDenEvent) => {
      this.#fetchOptions.quickFilterOptions = {
        searchTerm: event.data.filter.searchTerm,
        filterFn: event.data.filter.filterFn,
      };
      this.#getData(this.#fetchOptions).then((data: DataDenData) => {
        this.#publishFetchDone(event.context, {
          ...data,
          order: this.#fetchOptions.sortingOptions?.order,
        });
      });
    });
  }

  #subscribeFilterChange(): void {
    DataDenPubSub.subscribe('info:filtering:active-filters-changed', (event: DataDenEvent) => {
      this.#fetchOptions.filtersOptions = {
        filters: event.data.filters,
      };
      this.#getData(this.#fetchOptions).then((data: DataDenData) => {
        this.#publishFetchDone(event.context, {
          ...data,
          order: this.#fetchOptions.sortingOptions?.order,
        });
      });
    });
  }

  #subscribePaginationChange(): void {
    DataDenPubSub.subscribe('info:pagination:info-change:done', (event: DataDenEvent) => {
      this.#fetchOptions.paginationOptions = {
        firstRowIndex: event.data.firstRowIndex,
        lastRowIndex: event.data.lastRowIndex,
      };
      this.#getData(this.#fetchOptions).then((data: DataDenData) => {
        this.#publishFetchDone(event.context, {
          ...data,
          order: this.#fetchOptions.sortingOptions?.order,
        });
      });
    });
  }
}
