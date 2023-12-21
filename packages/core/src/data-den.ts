import './scss/index.scss';

import {
  DataDenHeaderCell,
  DataDenHeaderDateFilterRenderer,
  DataDenHeaderDefaultSorterRenderer,
  DataDenHeaderNumberFilterRenderer,
  DataDenHeaderTextFilterRenderer,
  DataDenRenderingService,
} from './modules/rendering';
import { DataDenPaginationService } from './modules/pagination';
import { DataDenDraggingService } from './modules/dragging';
import { DataDenResizingService } from './modules/resizing';
import { DataDenFilteringService } from './modules/filtering';
import { DataDenSortingService, DataDenSortingEvent } from './modules/sorting';
import { DataDenPinningEvent } from './modules/pinning';
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
import { deepCopy } from './utils';
import { DataDenQuickFilterChangeEvent } from './modules/rendering/filter/data-den-quick-filter-change-event.interface';
import { inject } from './utils/inject';
import { DataDenHeaderSelectFilterRenderer } from './modules/rendering/filter/data-den-header-select-filter-renderer';
import { DataDenPaginationRenderer } from './modules/rendering/pagination';
import { DataDenHeaderDefaultResizerRenderer } from './modules/rendering/resizer';
import { DataDenHeaderMenuRenderer } from './modules/rendering/menu';

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
    [
      DataDenHeaderCell,
      DataDenFetchService,
      DataDenRenderingService,
      DataDenSortingService,
      DataDenFilteringService,
      DataDenPaginationService,
      DataDenDraggingService,
      DataDenResizingService,
      DataDenHeaderDateFilterRenderer,
      DataDenHeaderNumberFilterRenderer,
      DataDenHeaderTextFilterRenderer,
      DataDenHeaderSelectFilterRenderer,
      DataDenPaginationRenderer,
      DataDenHeaderDefaultResizerRenderer,
      DataDenHeaderDefaultSorterRenderer,
      DataDenHeaderMenuRenderer,
    ].forEach((clazz) => {
      inject(clazz, 'PubSub', this.PubSub);
    });

    const gridOptions = this.#createOptions(defaultOptions, options);
    this.#dataLoaderStrategy = this.#getDataLoaderStrategy(gridOptions);

    if (this.#dataLoaderStrategy) {
      this.#fetch = new DataDenFetchService(this.#dataLoaderStrategy);
    }

    this.#rendering = new DataDenRenderingService(container, gridOptions);
    this.#sorting = new DataDenSortingService(gridOptions);
    this.#filtering = new DataDenFilteringService(gridOptions);
    this.#pagination = new DataDenPaginationService(gridOptions);
    this.#dragging = options.draggable ? new DataDenDraggingService(container, gridOptions) : null;
    this.#resizing = options.columns.some((column) => column.resize)
      ? new DataDenResizingService(container, gridOptions)
      : null;
  }

  on(name: string, callback: any) {
    DataDenEventEmitter.on(name, callback);
  }

  #createOptions(defaultOptions: DataDenInternalOptions, userOptions: DataDenOptions): DataDenInternalOptions {
    return deepMerge(deepCopy(defaultOptions), userOptions);
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

export {
  DataDenDefaultCellRenderer,
  DataDenClientDataLoaderStrategy,
  DataDenServerDataLoaderStrategy,
  DataDenDataLoaderStrategy,
  DataDenHeaderDateFilterRenderer,
  DataDenHeaderNumberFilterRenderer,
  DataDenHeaderTextFilterRenderer,
};

export type { DataDenOptions, DataDenSortingEvent, DataDenPinningEvent };
