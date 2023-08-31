import { DataDenRenderingService } from './modules/rendering';
import { DataDenPaginationService } from './modules/pagination';
import { DataDenFilteringService } from './modules/filtering';
import { DataDenSortingService } from './modules/sorting';
import { DataDenFetchService } from './modules/fetch';
import { DataDenOptions } from './data-den-options.interface';

export class DataDen {
  #rendering: DataDenRenderingService;
  #sorting: DataDenSortingService;
  private pagination: DataDenPaginationService = new DataDenPaginationService();
  private filtering: DataDenFilteringService = new DataDenFilteringService();
  private fetch: DataDenFetchService = new DataDenFetchService();

  constructor(container: HTMLElement, options: DataDenOptions) {
    this.#rendering = new DataDenRenderingService(container, options);
    this.#sorting = new DataDenSortingService();
  }
}
