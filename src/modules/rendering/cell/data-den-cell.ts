import { DataDenOptions } from '../../../data-den-options.interface';
import { DataDenCellEditor } from '../editor';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';
import { DataDenCellRendererParams } from './data-den-cell-renderer-params.interface';
import { createHtmlElement } from '../../../utils';

export class DataDenCell {
  #params: DataDenCellRendererParams;
  #columnIndex: number;
  #draggable: boolean | undefined;
  #columns: DataDenOptions['columns'];
  #renderer: DataDenCellRenderer;
  #editor: DataDenCellEditor;

  constructor(
    params: DataDenCellRendererParams,
    columnIndex: number,
    draggable: boolean | undefined,
    columns: DataDenOptions['columns'],
    renderer: DataDenCellRenderer,
    editor: DataDenCellEditor
  ) {
    this.#params = params;
    this.#columnIndex = columnIndex;
    this.#draggable = draggable;
    this.#columns = columns;
    this.#renderer = renderer;
    this.#editor = editor;
  }

  render(): HTMLElement {
    const template = `<div class="data-den-cell ${
      this.#draggable ? 'data-den-cell-draggable' : ''
    }" role="gridcell" ref="cell" style="left: ${this.#params.left}px; width: ${
      (this.#columns[this.#columnIndex].width || 120) - (this.#params.paddingX || 8)
    }px;"}></div>`;

    const cellElement = createHtmlElement(template);
    cellElement.appendChild(this.#renderer.getGui());

    return cellElement;
  }
}
