import { createHtmlElement } from '../../../utils';
import { escapeHtml } from '../../../utils/stringUtils';
import { DataDenCellRendererParams } from './data-den-cell-renderer-params.interface';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';

export class DataDenDefaultCellRenderer implements DataDenCellRenderer {
  element: HTMLElement;
  value: string;
  cssPrefix: string;

  constructor(params: DataDenCellRendererParams) {
    this.value = params.value;
    this.cssPrefix = params.cssPrefix;
    this.element = createHtmlElement(`<span class="${this.cssPrefix}cell-content">${escapeHtml(this.value)}</span>`);
  }

  getGui(): HTMLElement {
    return this.element;
  }
}
