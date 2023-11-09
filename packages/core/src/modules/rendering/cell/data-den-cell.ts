import { DataDenCellEditor, DataDenCellEditorParams, DataDenDefaultCellEditor } from '../editor';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';
import { DataDenCellRendererParams } from './data-den-cell-renderer-params.interface';
import { createHtmlElement } from '../../../utils';
import { DataDenInternalOptions } from '../../../data-den-options.interface';

export class DataDenCell {
  colIndex: number;
  rowIndex: number;
  #value: any;
  #options: DataDenInternalOptions;
  #renderer!: DataDenCellRenderer;
  #editor!: DataDenCellEditor;
  #left: number;
  #right: string;
  #width: number;

  constructor(
    value: any,
    colIndex: number,
    rowIndex: number,
    left: number,
    right: number,
    width: number,
    options: DataDenInternalOptions
  ) {
    this.colIndex = colIndex;
    this.rowIndex = rowIndex;
    this.#value = value;
    this.#options = options;
    this.#left = options.columns[colIndex].fixed === 'right' ? 0 : left;
    this.#right = options.columns[colIndex].fixed === 'right' ? `${right}px` : 'auto';
    this.#width = width;

    this.#initRenderers();
  }

  #initRenderers() {
    const colDef = this.#options.columns[this.colIndex];
    const cellRenderer = colDef.cellRenderer!;
    const cellRendererParams = this.#getCellRendererParams();
    const cellEditorParams = this.#getCellEditorParams();

    this.#renderer = new cellRenderer(cellRendererParams);
    this.#editor = new DataDenDefaultCellEditor(cellEditorParams);
  }

  #getCellRendererParams(): DataDenCellRendererParams {
    return {
      value: this.#value,
      cssPrefix: this.#options.cssPrefix,
    };
  }

  #getCellEditorParams(): DataDenCellEditorParams {
    return {
      value: this.#value,
      cssPrefix: this.#options.cssPrefix,
    };
  }

  render(): HTMLElement {
    const fixed = this.#options.columns[this.colIndex].fixed;
    const template =
      /* HTML */
      `
        <div
          class="${this.#options.cssPrefix}cell ${this.#options.draggable && !fixed
            ? `${this.#options.cssPrefix}cell-draggable`
            : ''} ${fixed === 'left' ? `${this.#options.cssPrefix}cell-fixed-left` : ''} ${fixed === 'right'
            ? `${this.#options.cssPrefix}cell-fixed-right`
            : ''}"
          role="gridcell"
          ref="cell"
          style="left: ${this.#left}px; width: ${this.#width}px; right: ${this.#right}"
        ></div>
      `;

    const cellElement = createHtmlElement(template);
    cellElement.appendChild(this.#renderer.getGui());

    return cellElement;
  }
}
