import { DataDenHeaderFilterChangeEvent, DataDenHeaderFilterRenderer } from '../filter';
import { DataDenHeaderDefaultSorterRenderer, DataDenHeaderSorterRenderer } from '../sorter';
import { DataDenHeaderDefaultResizerRenderer, DataDenHeaderResizerRenderer } from '../resizer';
import { DataDenHeaderMenuRenderer } from '../menu';
import { DataDenCell } from './data-den-cell';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';
import { DataDenColDef, DataDenInternalOptions } from '../../../data-den-options.interface';
import { DataDenHeaderFilterRendererParams } from '../filter/data-den-header-filter-renderer-params.interface';
import { DataDenSortOrder } from '../../sorting';
import { DataDenCellRendererParams } from './data-den-cell-renderer-params.interface';
import { createHtmlElement } from '../../../utils';
import { DataDenDefaultHeaderCellRenderer } from './data-den-default-header-cell-renderer';
import { Context } from '../../../context';
import { DataDenPubSub } from '../../../data-den-pub-sub';

export class DataDenHeaderCell extends DataDenCell {
  rowIndex: number;
  colIndex: number;
  width: number;
  #value: any;
  #left: string;
  pinned: string;
  #filterRenderer: DataDenHeaderFilterRenderer | null = null;
  #sorterRenderer: DataDenHeaderSorterRenderer | null = null;
  #resizerRenderer: DataDenHeaderResizerRenderer | null = null;
  #headerMenuRenderer: DataDenHeaderMenuRenderer | null = null;
  #renderer!: DataDenCellRenderer;
  #options: DataDenInternalOptions;
  #order: DataDenSortOrder;
  #isDropdownInitiated: boolean;

  constructor(
    value: any,
    colIndex: number,
    rowIndex: number,
    left: number,
    width: number,
    pinned: string,
    options: DataDenInternalOptions,
    order: DataDenSortOrder,
    private PubSub: DataDenPubSub
  ) {
    super(value, rowIndex, colIndex, left, width, pinned, options);

    this.#value = value;
    this.#left = pinned ? 'auto' : `${left}px`;
    this.width = width;
    this.pinned = pinned;
    this.colIndex = colIndex;
    this.rowIndex = rowIndex;
    this.#options = options;
    this.#order = order;

    this.#initRenderers();
  }

  #initRenderers() {
    const colDef = this.#options.columns[this.colIndex];
    const cssPrefix = this.#options.cssPrefix;
    const { field, filter, sort, resize } = colDef;
    const order = this.#order;

    this.#renderer = new DataDenDefaultHeaderCellRenderer(this.#getCellRendererParams());
    this.#headerMenuRenderer = new DataDenHeaderMenuRenderer(cssPrefix, colDef, this.colIndex, this.PubSub);

    if (filter) {
      const filterRenderer = colDef.filterRenderer;
      const filterParams = this.#getHeaderFilterParams(colDef);
      this.#filterRenderer = new filterRenderer(filterParams);
    }

    if (sort) {
      this.#sorterRenderer = new DataDenHeaderDefaultSorterRenderer(field, order, this.PubSub, this.#options);
    }

    if (resize) {
      this.#resizerRenderer = new DataDenHeaderDefaultResizerRenderer(cssPrefix, colDef, this.PubSub);
    }
  }

  #getCellRendererParams(): DataDenCellRendererParams {
    return {
      value: this.#value,
      cssPrefix: this.#options.cssPrefix,
    };
  }

  #getHeaderFilterParams(colDef: DataDenColDef): DataDenHeaderFilterRendererParams {
    const field = colDef.field;
    const { method, debounceTime, listOptions } = colDef.filterOptions;

    const params: DataDenHeaderFilterRendererParams = {
      colDef,
      field,
      method,
      debounceTime,
      cssPrefix: this.#options.cssPrefix,
      listOptions,
      filterChanged: () => this.#onFilterChange(),
    };

    return params;
  }

  #onFilterChange() {
    const colDef = this.#options.columns[this.colIndex];
    const field = colDef.field;

    const filter = this.#filterRenderer;
    const context = new Context('info:filtering:header-filter-changed');
    const type = filter.getType();
    const state = filter.getState();
    const isActive = filter.isActive();
    const filterFn = filter.getFilterFn();

    const filterChangeEvent: DataDenHeaderFilterChangeEvent = {
      context,
      field,
      type,
      state,
      isActive,
      filterFn,
    };

    this.PubSub.publish('info:filtering:header-filter-changed', filterChangeEvent);
  }

  render(): HTMLElement {
    const isSomeFilterableCol = this.#options.columns.some((col) => col.filter);
    const template =
      /* HTML */
      `<div
        class="${this.#options.cssPrefix}header-cell ${this.#options.draggable && !this.pinned
          ? `${this.#options.cssPrefix}header-cell-draggable`
          : ''} ${this.pinned === 'left' ? `${this.#options.cssPrefix}header-cell-pinned-left` : ''} ${this.pinned ===
        'right'
          ? `${this.#options.cssPrefix}header-cell-pinned-right`
          : ''} ${isSomeFilterableCol ? `${this.#options.cssPrefix}header-cell-filterable` : ''}"
        role="columnheader"
        ref="headerCell"
        style="left: ${this.#left}; width: ${this.width}px;"
      >
        <div ref="headerCellMain" class="${this.#options.cssPrefix}header-cell-main">
          <div ref="headerValueAndSorter" class="${this.#options.cssPrefix}header-value-and-sorter"></div>
        </div>
      </div>`;

    const cellElement = createHtmlElement(template);
    const cellElementMain = cellElement.querySelector('[ref="headerCellMain"]') as HTMLElement;
    const cellElementValueAndSorter = cellElement.querySelector('[ref="headerValueAndSorter"]') as HTMLElement;

    cellElementValueAndSorter.appendChild(this.#renderer.getGui());

    if (this.#sorterRenderer) {
      cellElementValueAndSorter.appendChild(this.#sorterRenderer.getGui());
    }

    if (this.#filterRenderer) {
      cellElement.appendChild(this.#filterRenderer.getGui());
    }

    cellElementMain.appendChild(this.#headerMenuRenderer.getGui());
    this.#renderDropdown(cellElement);

    if (this.#resizerRenderer) {
      cellElement.appendChild(this.#resizerRenderer.getGui());
    }

    return cellElement;
  }

  #renderDropdown(cellElement: HTMLElement) {
    if (this.#isDropdownInitiated) {
      return;
    }

    cellElement.appendChild(this.#headerMenuRenderer?.getDropdownGui());

    this.#isDropdownInitiated = true;
  }
}
