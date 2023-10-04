import { DataDenCellEditor } from '../editor';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';
import { DataDenCellRendererParams } from './data-den-cell-renderer-params.interface';
import { createHtmlElement } from '../../../utils';

export class DataDenCell {
  #params: DataDenCellRendererParams;
  #draggable: boolean | undefined;
  #renderer: DataDenCellRenderer;
  #editor: DataDenCellEditor;

  constructor(
    params: DataDenCellRendererParams,
    draggable: boolean | undefined,
    renderer: DataDenCellRenderer,
    editor: DataDenCellEditor
  ) {
    this.#params = params;
    this.#draggable = draggable;
    this.#renderer = renderer;
    this.#editor = editor;
  }

  render(): HTMLElement {
    const template = `<div class="data-den-cell ${
      this.#draggable ? 'data-den-cell-draggable' : ''
    }" role="gridcell" ref="cell" style="left: ${this.#params.left}px; width: ${this.#params.width}px;"></div>`;

    const cellElement = createHtmlElement(template);
    cellElement.appendChild(this.#renderer.getGui());

    return cellElement;
  }
}
