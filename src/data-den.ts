import { DataDenRenderingService } from './modules/rendering';
import { DataDenPaginationService } from './modules/pagination';
import { DataDenDraggingService } from './modules/dragging';
import { DataDenFilteringService } from './modules/filtering';
import { DataDenSortingService } from './modules/sorting';
import { DataDenFetchService } from './modules/fetch';
import { DataDenOptions } from './data-den-options.interface';

export class DataDen {
  #rendering: DataDenRenderingService;
  #pagination: DataDenPaginationService;
  #dragging: DataDenDraggingService;
  #filtering: DataDenFilteringService = new DataDenFilteringService();
  #sorting: DataDenSortingService = new DataDenSortingService();
  #fetch: DataDenFetchService = new DataDenFetchService();

  constructor(container: HTMLElement, options: DataDenOptions) {
    this.#rendering = new DataDenRenderingService(container, options);
    this.#pagination = new DataDenPaginationService(options.paginationOptions);
    this.#dragging = new DataDenDraggingService(container, options);

    // await this.fetch.fetchData(options.fetchOptions);

    this.#pagination.init(options.rows);
  }
}
