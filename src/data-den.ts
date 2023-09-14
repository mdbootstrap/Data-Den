import { DataDenRenderingService } from './modules/rendering';
import { DataDenPaginationService } from './modules/pagination';
import { DataDenDraggingService } from './modules/dragging';
import { DataDenResizingService } from './modules/resizing';
import { DataDenFilteringService } from './modules/filtering';
import { DataDenSortingService } from './modules/sorting';
import { DataDenFetchService } from './modules/fetch';
import { DataDenOptions } from './data-den-options.interface';

export class DataDen {
  #rendering: DataDenRenderingService;
  #sorting: DataDenSortingService;
  #filtering: DataDenFilteringService;
  #pagination: DataDenPaginationService;
  #dragging: DataDenDraggingService;
  #resizing: DataDenResizingService;
  #fetch: DataDenFetchService = new DataDenFetchService();

  constructor(container: HTMLElement, options: DataDenOptions) {
    this.#rendering = new DataDenRenderingService(container, options);
    this.#sorting = new DataDenSortingService();
    this.#filtering = new DataDenFilteringService(options.quickFilterOptions);
    this.#pagination = new DataDenPaginationService(options.paginationOptions);
    this.#dragging = new DataDenDraggingService(container, options);
    this.#resizing = new DataDenResizingService(container, options);

    // await fetch

    this.#pagination.init(options.rows);
  }
}
