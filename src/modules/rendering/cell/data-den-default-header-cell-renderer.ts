import { DataDenCellRendererParams } from './data-den-cell-renderer-params.interface';
import { DataDenCellRenderer } from './data-den-cell-renderer.interface';
import { createHtmlElement } from '../../../utils/dom';
import { DataDenOptions } from '../../../data-den-options.interface';
import { DataDenPubSub } from '../../../data-den-pub-sub';
import { Context } from '../../../context';

export class DataDenDefaultHeaderCellRenderer implements DataDenCellRenderer {
  element: HTMLElement;

  constructor(params: DataDenCellRendererParams, colIndex: number, options: DataDenOptions) {
    const template = `<div class="data-den-header-cell ${
      options.draggable ? 'data-den-header-cell-draggable' : ''
    }" role="columnheader" style="left: ${params.left}px; width: ${options.columns[colIndex].width || 120}px">${
      params.value
    }</div>`;

    this.element = createHtmlElement(template);

    if (options.draggable) {
      this.#initDragEvents();
    }
  }

  getGui(): HTMLElement {
    return this.element;
  }

  #initDragEvents() {
    this.element.addEventListener('mousedown', (event: MouseEvent) => {
      event.stopPropagation();
      DataDenPubSub.publish('command:dragging:mousedown:start', {
        element: this.element,
        context: new Context('command:dragging:mousedown:start'),
      });
    });
  }
}
