import { DataDenCellRendererParams } from './data-den-cell-renderer-params.interface';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';
import { createHtmlElement } from '../../../utils/dom';

export class DataDenDefaultHeaderCellRenderer implements DataDenCellRenderer {
  element: HTMLElement;

  constructor(params: DataDenCellRendererParams, draggable: boolean | undefined) {
    const template = `<div class="data-den-header-cell ${
      draggable ? 'data-den-header-cell-draggable' : ''
    }" role="columnheader" ref="headerCell" style="left: ${params.left}px; width: ${
      params.width
    }px"><div class="data-den-header-cell-value">${params.value}</div></div>`;

    this.element = createHtmlElement(template);
  }

  getGui(): HTMLElement {
    return this.element;
  }
}
