import { DataDenRenderingService } from './modules/rendering';
import { DataDenPaginationService } from './modules/pagination';
import { DataDenFilteringService } from './modules/filtering';
import { DataDenSortingService } from './modules/sorting';
import { DataDenFetchService } from './modules/fetch';
import { DataDenOptions } from './data-den-options.interface';

export class DataDen {
  #rendering: DataDenRenderingService;
  #sorting: DataDenSortingService;
  #filtering: DataDenFilteringService;
  #pagination: DataDenPaginationService;
  #fetch: DataDenFetchService;

  constructor(container: HTMLElement, options: DataDenOptions) {
    this.#fetch = new DataDenFetchService(options);
    this.#rendering = new DataDenRenderingService(container, options);
    this.#sorting = new DataDenSortingService();
    this.#filtering = new DataDenFilteringService(options.quickFilterOptions);
    this.#pagination = new DataDenPaginationService(options.paginationOptions);
  }
}
