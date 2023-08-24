import { createHtmlElement } from '../../../utils';
import { DataDenHeaderCell } from '../cell/data-den-header-cell';
import { DataDenRow } from './data-den-row';

export class DataDenHeaderRow extends DataDenRow {
  constructor(public index: number, public cells: DataDenHeaderCell[]) {
    super(index, cells);

    const template = `<div class="data-den-header-row" role="row"></div>`;

    this.element = createHtmlElement(template);
  }

  render(): HTMLElement {
    const cells = document.createDocumentFragment();

    this.cells.forEach((cell) => cells.appendChild(cell.render()));
    this.element.appendChild(cells);

    return this.element;
  }
}
