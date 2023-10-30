import './scss/index.scss';

import { DataDenRenderingService } from './modules/rendering';
import { DataDenPaginationService } from './modules/pagination';
import { DataDenDraggingService } from './modules/dragging';
import { DataDenResizingService } from './modules/resizing';
import { DataDenFilteringService } from './modules/filtering';
import { DataDenSortingService, DataDenSortingEvent } from './modules/sorting';
import { DataDenFetchService } from './modules/fetch';
import { DataDenDefaultCellRenderer } from './modules/rendering/cell/data-den-default-cell-renderer';
import {
  DataDenClientDataLoaderStrategy,
  DataDenServerDataLoaderStrategy,
  DataDenDataLoaderStrategy,
} from './modules/fetch';
import { DataDenPubSub } from './data-den-pub-sub';
import { DataDenEventEmitter } from './data-den-event-emitter';
import { Context } from './context';
import { DataDenInternalOptions, DataDenOptions } from './data-den-options.interface';
import { defaultOptions } from './default-options.interface';
import { deepMerge } from './utils/deep-merge';

export class DataDen {
  #rendering: DataDenRenderingService;
  #sorting: DataDenSortingService;
  #filtering: DataDenFilteringService;
  #pagination: DataDenPaginationService;
  #dragging: DataDenDraggingService;
  #resizing: DataDenResizingService | null;
  #dataLoaderStrategy: DataDenDataLoaderStrategy | null = null;
  #fetch: DataDenFetchService | null = null;

  constructor(container: HTMLElement, options: DataDenOptions) {
    const gridOptions = this.#createOptions(defaultOptions, options);
    this.#dataLoaderStrategy = this.#getDataLoaderStrategy(gridOptions);

    if (this.#dataLoaderStrategy) {
      this.#fetch = new DataDenFetchService(this.#dataLoaderStrategy);
    }

    this.#rendering = new DataDenRenderingService(container, gridOptions);
    this.#sorting = new DataDenSortingService();
    this.#filtering = new DataDenFilteringService(gridOptions);
    this.#pagination = new DataDenPaginationService(gridOptions);
    this.#dragging = new DataDenDraggingService(container, gridOptions);
    this.#resizing = options.columns.some((column) => column.resize)
      ? new DataDenResizingService(container, gridOptions)
      : null;
  }

  on(name: string, callback: any) {
    DataDenEventEmitter.on(name, callback);
  }

  #createOptions(defaultOptions: DataDenInternalOptions, userOptions: DataDenOptions): DataDenInternalOptions {
    return deepMerge(defaultOptions, userOptions);
  }

  #getDataLoaderStrategy(options: DataDenOptions): DataDenDataLoaderStrategy | null {
    const { mode, rows } = options;

    if (mode === 'client' && rows.length) {
      return new DataDenClientDataLoaderStrategy(options.rows);
    }

    if (mode === 'server') {
      return new DataDenServerDataLoaderStrategy();
    }

    return null;
  }

  sort(field: string, order: string): void {
    const command = 'command:sorting:start';
    DataDenPubSub.publish(command, {
      context: new Context(command),
      field,
      order,
    });
  }
}

export {
  DataDenDefaultCellRenderer,
  DataDenClientDataLoaderStrategy,
  DataDenServerDataLoaderStrategy,
  DataDenDataLoaderStrategy,
};

export type { DataDenOptions, DataDenSortingEvent };
