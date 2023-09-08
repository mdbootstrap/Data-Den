import { DataDenOptions } from '../../../data-den-options.interface';
import { createHtmlElement } from '../../../utils';
import { DataDenCellRendererParams } from './data-den-cell-renderer-params.interface';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';

export class DataDenDefaultCellRenderer implements DataDenCellRenderer {
  element: HTMLElement;

  constructor(params: DataDenCellRendererParams, colIndex: number, options: DataDenOptions) {
    const template = `<div class="data-den-cell ${
      options?.draggable ? 'data-den-cell-draggable' : ''
    }" role="gridcell" style="left: ${params.left}px; width: ${options?.columns[colIndex].width || 120}px"}>${
      params.value
    }</div>`;

    this.element = createHtmlElement(template);
  }

  getGui(): HTMLElement {
    return this.element;
  }
}
