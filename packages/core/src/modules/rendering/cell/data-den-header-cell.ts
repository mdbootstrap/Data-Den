import { DataDenHeaderFilterChangeEvent, DataDenHeaderFilterRenderer } from '../filter';
import { DataDenHeaderDefaultSorterRenderer, DataDenHeaderSorterRenderer } from '../sorter';
import { DataDenHeaderDefaultResizerRenderer, DataDenHeaderResizerRenderer } from '../resizer';
import { DataDenCell } from './data-den-cell';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';
import { DataDenColDef, DataDenInternalOptions } from '../../../data-den-options.interface';
import { DataDenHeaderFilterRendererParams } from '../filter/data-den-header-filter-renderer-params.interface';
import { Order } from '../../sorting';
import { DataDenCellRendererParams } from './data-den-cell-renderer-params.interface';
import { createHtmlElement } from '../../../utils';
import { DataDenDefaultHeaderCellRenderer } from './data-den-default-header-cell-renderer';
import { Context } from '../../../context';
import { DataDenPubSub } from '../../../data-den-pub-sub';

export class DataDenHeaderCell extends DataDenCell {
  rowIndex: number;
  colIndex: number;
  #value: any;
  #left: number;
  #width: number;
  #filterRenderer: DataDenHeaderFilterRenderer | null = null;
  #sorterRenderer: DataDenHeaderSorterRenderer | null = null;
  #resizerRenderer: DataDenHeaderResizerRenderer | null = null;
  #renderer!: DataDenCellRenderer;
  #options: DataDenInternalOptions;
  #order: Order;

  constructor(
    value: any,
    colIndex: number,
    rowIndex: number,
    left: number,
    width: number,
    options: DataDenInternalOptions,
    order: Order
  ) {
    super(value, rowIndex, colIndex, left, width, options);

    this.#value = value;
    this.#left = left;
    this.#width = width;
    this.colIndex = colIndex;
    this.rowIndex = colIndex;
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

    if (filter) {
      const filterRenderer = colDef.filterRenderer;
      const filterParams = this.#getHeaderFilterParams(colDef);
      this.#filterRenderer = new filterRenderer(filterParams);
    }

    if (sort) {
      this.#sorterRenderer = new DataDenHeaderDefaultSorterRenderer(field, order, cssPrefix);
    }

    if (resize) {
      this.#resizerRenderer = new DataDenHeaderDefaultResizerRenderer(cssPrefix);
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

    DataDenPubSub.publish('info:filtering:header-filter-changed', filterChangeEvent);
  }

  render(): HTMLElement {
    const template =
      /* HTML */
      `<div
        class="${this.#options.cssPrefix}header-cell ${this.#options.draggable
          ? `${this.#options.cssPrefix}header-cell-draggable`
          : ''}"
        role="columnheader"
        ref="headerCell"
        style="left: ${this.#left}px; width: ${this.#width}px"
      ></div>`;

    const cellElement = createHtmlElement(template);
    cellElement.appendChild(this.#renderer.getGui());

    if (this.#filterRenderer) {
      cellElement.appendChild(this.#filterRenderer.getGui());
    }

    if (this.#sorterRenderer) {
      cellElement
        .querySelector(`.${this.#options.cssPrefix}header-cell-value`)!
        .appendChild(this.#sorterRenderer.getGui());
    }

    if (this.#resizerRenderer) {
      cellElement.appendChild(this.#resizerRenderer.getGui());
    }

    return cellElement;
  }
}
