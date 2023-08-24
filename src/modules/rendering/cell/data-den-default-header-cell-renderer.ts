import { DataDenCellRendererParams } from './data-den-cell-renderer-params.interface';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';
import { createHtmlElement } from '../../../utils/dom';

export class DataDenDefaultHeaderCellRenderer implements DataDenCellRenderer {
  element: HTMLElement;

  constructor(params: DataDenCellRendererParams) {
    const template = `<div class="data-den-header-cell" role="columnheader">${params.value}</div>`;

    this.element = createHtmlElement(template);
  }

  getGui(): HTMLElement {
    return this.element;
  }
}
