import { createHtmlElement } from '../../../utils';
import { DataDenCellRendererParams } from './data-den-cell-renderer-params.interface';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';

export class DataDenDefaultCellRenderer implements DataDenCellRenderer {
  element: HTMLElement;

  constructor(params: DataDenCellRendererParams) {
    const template = `<div class="data-den-cell" role="gridcell">${params.value}</div>`;

    this.element = createHtmlElement(template);
  }

  getGui(): HTMLElement {
    return this.element;
  }
}
