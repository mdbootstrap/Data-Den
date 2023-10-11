import { DataDenCellEditor } from '../editor';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';
import { DataDenCellRendererParams } from './data-den-cell-renderer-params.interface';
import { createHtmlElement } from '../../../utils';

export class DataDenCell {
  #params: DataDenCellRendererParams;
  #draggable: boolean | undefined;
  #renderer: DataDenCellRenderer;
  #editor: DataDenCellEditor;
  #cssPrefix: string;

  constructor(
    params: DataDenCellRendererParams,
    draggable: boolean | undefined,
    renderer: DataDenCellRenderer,
    editor: DataDenCellEditor,
    cssPrefix: string
  ) {
    this.#params = params;
    this.#draggable = draggable;
    this.#renderer = renderer;
    this.#editor = editor;
    this.#cssPrefix = cssPrefix;
  }

  render(): HTMLElement {
    const template = `
      <div
        class="${this.#cssPrefix}cell ${this.#draggable ? `${this.#cssPrefix}cell-draggable` : ''}"
        role="gridcell"
        ref="cell"
        style="left: ${this.#params.left}px; width: ${this.#params.width}px;"
      >
      </div>
    `;

    const cellElement = createHtmlElement(template);
    cellElement.appendChild(this.#renderer.getGui());

    return cellElement;
  }
}
