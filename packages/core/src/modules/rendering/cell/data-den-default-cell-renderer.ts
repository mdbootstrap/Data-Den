import { createHtmlElement } from '../../../utils';
import { DataDenCellRendererParams } from './data-den-cell-renderer-params.interface';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';

export class DataDenDefaultCellRenderer implements DataDenCellRenderer {
  element: HTMLElement;
  value: string;

  constructor(params: DataDenCellRendererParams) {
    this.value = params.value;
    this.element = createHtmlElement(`<span>${this.value}</span>`);
  }

  getGui(): HTMLElement {
    return this.element;
  }

  setValue(value: string): void {
    this.element = createHtmlElement(`<span>${value}</span>`);
  }
}
