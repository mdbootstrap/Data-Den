import { createHtmlElement } from '../../../utils';
import { escapeHtml } from '../../../utils/stringUtils';
import { DataDenCellRendererParams } from './data-den-cell-renderer-params.interface';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';

export class DataDenDefaultCellRenderer implements DataDenCellRenderer {
  element: HTMLElement;
  value: string;
  cssPrefix: string;
  isGroupCell: boolean;
  icon: HTMLElement;

  constructor(params: DataDenCellRendererParams) {
    this.value = params.value;
    this.cssPrefix = params.cssPrefix;
    this.icon = params.icon;
    this.isGroupCell = params.isGroupCell

    this.element = createHtmlElement(`<span style="line-height:300%" class="${this.cssPrefix}cell-content ${this.isGroupCell ? `${this.cssPrefix}group` : ''}">
    ${this.icon ? `<div class="${this.cssPrefix}cell-icon">
      ${this.icon.outerHTML}
    </div>` : ''}
    ${escapeHtml(this.value)}
    </span>`);


    // this.isGroupCell && this.element.addEventListener('click', (e) => {
    //   const arrow = e.target as HTMLElement;
    //   arrow.parentElement.classList.toggle(`${this.cssPrefix}cell-icon-rotated`);
    // });
  }

  getGui(): HTMLElement {
    return this.element;
  }
}
