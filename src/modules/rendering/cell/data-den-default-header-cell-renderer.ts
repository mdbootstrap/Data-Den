import { DataDenCellRendererParams } from './data-den-cell-renderer-params.interface';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';
import { createHtmlElement } from '../../../utils/dom';
import { DataDenOptions } from '../../../data-den-options.interface';

export class DataDenDefaultHeaderCellRenderer implements DataDenCellRenderer {
  element: HTMLElement;

  constructor(params: DataDenCellRendererParams, colIndex: number, options: DataDenOptions) {
    const template = `<div class="data-den-header-cell ${
      options.draggable ? 'data-den-header-cell-draggable' : ''
    }" role="columnheader" ref="headerCell" style="left: ${params.left}px; width: ${
      (options.columns[colIndex].width || 120) - (params.paddingX || 8) - (params.borderWidth || 2)
    }px">${params.value}</div>`;

    this.element = createHtmlElement(template);
  }

  getGui(): HTMLElement {
    return this.element;
  }
}
