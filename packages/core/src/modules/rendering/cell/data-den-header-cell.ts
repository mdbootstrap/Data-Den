import {
  DataDenHeaderDateFilterRenderer,
  DataDenHeaderFilterRenderer,
  DataDenHeaderNumberFilterRenderer,
  DataDenHeaderTextFilterRenderer,
} from '../filter';
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
      this.#filterRenderer = this.#getHeaderFilterRenderer(colDef);
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

  #getHeaderFilterRenderer(colDef: DataDenColDef) {
    const field = colDef.field;
    const { type, method, debounceTime } = colDef.filterOptions!;
    const params: DataDenHeaderFilterRendererParams = {
      field,
      method,
      debounceTime,
      cssPrefix: this.#options.cssPrefix,
    };

    switch (type) {
      case 'text':
        return new DataDenHeaderTextFilterRenderer(params);
      case 'number':
        return new DataDenHeaderNumberFilterRenderer(params);
      case 'date':
        return new DataDenHeaderDateFilterRenderer(params);
      default:
        return new DataDenHeaderTextFilterRenderer(params);
    }
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
