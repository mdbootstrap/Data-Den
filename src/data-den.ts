import { DataDenRenderingService } from './modules/rendering';
import { DataDenPaginationService } from './modules/pagination';
import { DataDenFilteringService } from './modules/filtering';
import { DataDenSortingService } from './modules/sorting';
import { DataDenFetchService } from './modules/fetch';
import { DataDenOptions } from './data-den-options.interface';

export class DataDen {
  #rendering: DataDenRenderingService;
  private pagination: DataDenPaginationService;
  private filtering: DataDenFilteringService = new DataDenFilteringService();
  private sorting: DataDenSortingService = new DataDenSortingService();
  private fetch: DataDenFetchService = new DataDenFetchService();

  constructor(container: HTMLElement, options: DataDenOptions) {
    this.#rendering = new DataDenRenderingService(container, options);
    this.pagination = new DataDenPaginationService(options.paginationOptions);

    // await this.fetch.fetchData(options.fetchOptions);

    this.pagination.init(options.rows);
  }
}
