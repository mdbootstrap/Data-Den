import { DataDenCellEditor, DataDenCellEditorParams, DataDenDefaultCellEditor } from '../editor';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';
import { DataDenCellRendererParams } from './data-den-cell-renderer-params.interface';
import { createHtmlElement } from '../../../utils';
import { DataDenInternalOptions } from '../../../data-den-options.interface';

export class DataDenCell {
  colIndex: number;
  rowIndex: number;
  width: number;
  #value: any;
  #options: DataDenInternalOptions;
  #renderer!: DataDenCellRenderer;
  #editor!: DataDenCellEditor;
  #left: string;
  #fixed: string;

  constructor(
    value: any,
    colIndex: number,
    rowIndex: number,
    left: number,
    width: number,
    fixed: string,
    options: DataDenInternalOptions
  ) {
    this.colIndex = colIndex;
    this.rowIndex = rowIndex;
    this.width = width;
    this.#value = value;
    this.#options = options;
    this.#left = fixed ? 'auto' : `${left}px`;
    this.#fixed = fixed;

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
    const template =
      /* HTML */
      `
        <div
          class="${this.#options.cssPrefix}cell ${this.#options.draggable && !this.#fixed
            ? `${this.#options.cssPrefix}cell-draggable`
            : ''} ${this.#fixed === 'left' ? `${this.#options.cssPrefix}cell-fixed-left` : ''} ${this.#fixed === 'right'
            ? `${this.#options.cssPrefix}cell-fixed-right`
            : ''}"
          role="gridcell"
          ref="cell"
          style="left: ${this.#left}; width: ${this.width}px;"
        ></div>
      `;

    const cellElement = createHtmlElement(template);
    cellElement.appendChild(this.#renderer.getGui());

    return cellElement;
  }
}
