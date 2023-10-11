import { DataDenCellRendererParams } from './data-den-cell-renderer-params.interface';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';
import { createHtmlElement } from '../../../utils/dom';

export class DataDenDefaultHeaderCellRenderer implements DataDenCellRenderer {
  element: HTMLElement;
  #cssPrefix: string;

  constructor(params: DataDenCellRendererParams, draggable: boolean | undefined) {
    this.#cssPrefix = params.cssPrefix;

    const template = `
      <div
        class="${this.#cssPrefix}header-cell ${draggable ? `${this.#cssPrefix}header-cell-draggable` : ''}"
        role="columnheader"
        ref="headerCell"
        style="left: ${params.left}px; width: ${params.width}px"
      >
        <div class="${this.#cssPrefix}header-cell-value">${params.value}</div>
      </div>
    `;

    this.element = createHtmlElement(template);
  }

  getGui(): HTMLElement {
    return this.element;
  }
}
