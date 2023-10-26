import { DataDenCell } from '../cell/data-den-cell';
import { createHtmlElement } from '../../../utils/dom';
import { DataDenInternalOptions } from '../../../data-den-options.interface';

export class DataDenRow {
  element: HTMLElement;

  constructor(public index: number, public cells: DataDenCell[], options: DataDenInternalOptions) {
    const template =
      /* HTML */
      `<div
        class="${options.cssPrefix}-row"
        role="row"
        ref="row"
        style="height: ${options.rowHeight}px; top: ${index * options.rowHeight}px"
      ></div>`;

    this.element = createHtmlElement(template);
  }

  render(): HTMLElement {
    const cells = document.createDocumentFragment();

    this.cells.forEach((cell) => cells.appendChild(cell.render()));
    this.element.appendChild(cells);

    return this.element;
  }
}
