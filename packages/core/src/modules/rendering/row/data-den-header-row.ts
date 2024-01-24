import { DataDenInternalOptions } from '../../../data-den-options.interface';
import { createHtmlElement } from '../../../utils';
import { DataDenHeaderCell } from '../cell/data-den-header-cell';
import { DataDenRow } from './data-den-row';

export class DataDenHeaderRow extends DataDenRow {
  #options: DataDenInternalOptions;

  constructor(public index: number, public cells: DataDenHeaderCell[], options: DataDenInternalOptions) {
    super(index, cells, options);
    this.#options = options;
    const height = this.#options.columns.some((el) => el.filter) ? options.headerHeight + 15 : options.headerHeight;

    const template =
      /* HTML */
      `<div class="${options.cssPrefix}header-row" role="row" ref="headerRow" style="height: ${height}px"></div>`;

    this.element = createHtmlElement(template);
  }

  render(): HTMLElement {
    const cells = document.createDocumentFragment();

    const leftCellsWidth = this.cells
      .filter((cell) => cell.pinned === 'left')
      .reduce((acc, curr) => acc + curr.width, 0);
    const rightCellsWidth = this.cells
      .filter((cell) => cell.pinned === 'right')
      .reduce((acc, curr) => acc + curr.width, 0);

    const leftCellsWrapper = createHtmlElement(
      /* HTML */
      `<div ref="headerLeftCellsWrapper" class="${this.#options.cssPrefix}header-left-cells-wrapper"></div>`
    );
    const centerCellsWrapper = createHtmlElement(
      /* HTML */
      `<div
        ref="headerMainCellsWrapper"
        class="${this.#options.cssPrefix}header-main-cells-wrapper"
        style="left: ${leftCellsWidth}px; width: calc(100% - ${leftCellsWidth + rightCellsWidth}px)"
      ></div>`
    );
    const rightCellsWrapper = createHtmlElement(
      /* HTML */
      `<div ref="headerRightCellsWrapper" class="${this.#options.cssPrefix}header-right-cells-wrapper"></div>`
    );

    cells.appendChild(leftCellsWrapper);
    cells.appendChild(centerCellsWrapper);
    cells.appendChild(rightCellsWrapper);

    this.cells.filter((cell) => cell.pinned === 'left').forEach((cell) => leftCellsWrapper.appendChild(cell.render()));
    this.cells.filter((cell) => !cell.pinned).forEach((cell) => centerCellsWrapper.appendChild(cell.render()));
    this.cells
      .filter((cell) => cell.pinned === 'right')
      .forEach((cell) => rightCellsWrapper.appendChild(cell.render()));

    this.element.appendChild(cells);

    return this.element;
  }
}
