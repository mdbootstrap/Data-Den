import './scss/index.scss';

import { DataDenRenderingService } from './modules/rendering';
import { DataDenPaginationService } from './modules/pagination';
import { DataDenDraggingService } from './modules/dragging';
import { DataDenResizingService } from './modules/resizing';
import { DataDenFilteringService } from './modules/filtering';
import { DataDenSortingService } from './modules/sorting';
import { DataDenFetchService } from './modules/fetch';
import {
  DataDenClientDataLoaderStrategy,
  DataDenServerDataLoaderStrategy,
  DataDenDataLoaderStrategy,
} from './modules/fetch';
import { DataDenPubSub } from './data-den-pub-sub';
import { DataDenEventEmitter } from './data-den-event-emitter';
import { Context } from './context';
import { DataDenColDef, DataDenInternalOptions, DataDenOptions } from './data-den-options.interface';
import { defaultOptions } from './default-options.interface';
import { deepMerge } from './utils/deep-merge';
import { deepCopy } from './utils';
import { DataDenQuickFilterChangeEvent } from './modules/rendering/filter/data-den-quick-filter-change-event.interface';

export class DataDen {
  #rendering: DataDenRenderingService;
  #sorting: DataDenSortingService;
  #filtering: DataDenFilteringService;
  #pagination: DataDenPaginationService;
  #dragging: DataDenDraggingService | null;
  #resizing: DataDenResizingService | null;
  #dataLoaderStrategy: DataDenDataLoaderStrategy | null = null;
  #fetch: DataDenFetchService | null = null;

  private PubSub: DataDenPubSub = new DataDenPubSub();

  constructor(container: HTMLElement, options: DataDenOptions) {
    const gridOptions = this.#createOptions(defaultOptions, options);
    this.#dataLoaderStrategy = this.#getDataLoaderStrategy(gridOptions);

    if (this.#dataLoaderStrategy) {
      this.#fetch = new DataDenFetchService(this.#dataLoaderStrategy, this.PubSub);
    }

    this.#rendering = new DataDenRenderingService(container, gridOptions, this.PubSub);
    this.#sorting = new DataDenSortingService(gridOptions, this.PubSub);
    this.#filtering = new DataDenFilteringService(gridOptions, this.PubSub);
    this.#pagination = new DataDenPaginationService(gridOptions, this.PubSub);
    this.#dragging = options.draggable ? new DataDenDraggingService(container, gridOptions, this.PubSub) : null;
    this.#resizing = options.columns.some((column) => column.resize)
      ? new DataDenResizingService(container, gridOptions, this.PubSub)
      : null;
  }

  on(name: string, callback: any) {
    DataDenEventEmitter.on(name, callback);
  }

  #createOptions(defaultOptions: DataDenInternalOptions, userOptions: DataDenOptions): DataDenInternalOptions {
    const options = deepMerge(deepCopy(defaultOptions), userOptions);

    options.columns.forEach((colDef: DataDenColDef, index: number) => {
      options.columns[index] = deepMerge(deepCopy(options.defaultColDef), colDef);
    });

    return options;
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
    this.PubSub.publish(command, {
      context: new Context(command),
      field,
      order,
    });
  }

  quickFilter(searchTerm: any) {
    const context = new Context('info:filtering:quick-filter-changed');
    const event: DataDenQuickFilterChangeEvent = {
      context,
      searchTerm,
    };

    this.PubSub.publish('info:filtering:quick-filter-changed', event);
  }

  pinColumn(pin: string | boolean, colIndex: number) {
    const command = 'command:pin-column:start';
    this.PubSub.publish(command, {
      context: new Context(command),
      pin,
      colIndex,
    });
  }
}
