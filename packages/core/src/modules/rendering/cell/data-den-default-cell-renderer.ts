import { createHtmlElement } from '../../../utils';
import { DataDenCellRendererParams } from './data-den-cell-renderer-params.interface';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';

export class DataDenDefaultCellRenderer implements DataDenCellRenderer {
  element: HTMLElement;
  value: string;
  cssPrefix: string;

  constructor(params: DataDenCellRendererParams) {
    this.value = params.value;
    this.cssPrefix = params.cssPrefix;
    this.element = createHtmlElement(`<span class="${this.cssPrefix}cell-content">${this.value}</span>`);
  }

  getGui(): HTMLElement {
    return this.element;
  }

  setValue(value: string): void {
    this.element = createHtmlElement(`<span class="${this.cssPrefix}cell-content">${value}&nbsp;</span>`);
  }
}
