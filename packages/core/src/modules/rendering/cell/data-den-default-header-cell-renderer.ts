import { DataDenCellRendererParams } from './data-den-cell-renderer-params.interface';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';
import { createHtmlElement } from '../../../utils/dom';

export class DataDenDefaultHeaderCellRenderer implements DataDenCellRenderer {
  element: HTMLElement;
  #cssPrefix: string;

  constructor(params: DataDenCellRendererParams) {
    this.#cssPrefix = params.cssPrefix;

    const template = `<div class="${this.#cssPrefix}header-cell-value">${params.value}</div>`;

    this.element = createHtmlElement(template);
  }

  getGui(): HTMLElement {
    return this.element;
  }
}
