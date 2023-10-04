import { DataDenCell } from '../cell/data-den-cell';
import { createHtmlElement } from '../../../utils/dom';

export class DataDenRow {
  element: HTMLElement;

  constructor(public index: number, public cells: DataDenCell[], rowHeight: number) {
    this.index = index;
    this.cells = cells;

    const template = `<div class="data-den-row" role="row" ref="row" style="top: ${index * rowHeight}px"></div>`;

    this.element = createHtmlElement(template);
  }

  render(): HTMLElement {
    const cells = document.createDocumentFragment();

    this.cells.forEach((cell) => cells.appendChild(cell.render()));
    this.element.appendChild(cells);

    return this.element;
  }
}
