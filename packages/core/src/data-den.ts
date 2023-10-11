import './scss/index.scss';

import { DataDenRenderingService } from './modules/rendering';
import { DataDenPaginationService } from './modules/pagination';
import { DataDenDraggingService } from './modules/dragging';
import { DataDenResizingService } from './modules/resizing';
import { DataDenFilteringService } from './modules/filtering';
import { DataDenSortingService } from './modules/sorting';
import { DataDenFetchService } from './modules/fetch';
import { DataDenDefaultCellRenderer } from './modules/rendering/cell/data-den-default-cell-renderer';
import {
  DataDenClientDataLoaderStrategy,
  DataDenServerDataLoaderStrategy,
  DataDenDataLoaderStrategy,
} from './modules/fetch';
import { DataDenData } from './data-den-data.interface';
import { DataDenOptions } from './data-den-options.interface';

export class DataDen {
  #rendering: DataDenRenderingService;
  #sorting: DataDenSortingService;
  #filtering: DataDenFilteringService;
  #pagination: DataDenPaginationService;
  #dragging: DataDenDraggingService;
  #resizing: DataDenResizingService;
  #fetch: DataDenFetchService;

  constructor(container: HTMLElement, options: DataDenOptions) {
    this.#fetch = new DataDenFetchService(options);
    this.#rendering = new DataDenRenderingService(container, options);
    this.#sorting = new DataDenSortingService(container);
    this.#filtering = new DataDenFilteringService(options);
    this.#pagination = new DataDenPaginationService(options.paginationOptions);
    this.#dragging = new DataDenDraggingService(container, options);
    this.#resizing = new DataDenResizingService(container, options);
  }
}

export {
  DataDenDefaultCellRenderer,
  DataDenClientDataLoaderStrategy,
  DataDenServerDataLoaderStrategy,
  DataDenDataLoaderStrategy,
};

export type { DataDenData, DataDenOptions };
