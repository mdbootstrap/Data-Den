import { createHtmlElement } from '../../../utils';
import { DataDenCellRendererParams } from './data-den-cell-renderer-params.interface';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';

export class DataDenDefaultCellRenderer implements DataDenCellRenderer {
  element: HTMLElement;

  constructor(params: DataDenCellRendererParams) {
    this.element = createHtmlElement(`<span>${params.value}</span>`);
  }

  getGui(): HTMLElement {
    return this.element;
  }
}
