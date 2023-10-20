import { DataDenInternalOptions } from '../../../data-den-options.interface';
import { createHtmlElement } from '../../../utils';
import { DataDenHeaderCell } from '../cell/data-den-header-cell';
import { DataDenRow } from './data-den-row';

export class DataDenHeaderRow extends DataDenRow {
  constructor(public index: number, public cells: DataDenHeaderCell[], options: DataDenInternalOptions) {
    super(index, cells, options);

    const template =
      /* HTML */
      `<div
        class="${options.cssPrefix}header-row ${options.draggable ? `${options.cssPrefix}header-row-draggable` : ''}"
        role="row"
        ref="headerRow"
        style="height: ${options.rowHeight}px"
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
