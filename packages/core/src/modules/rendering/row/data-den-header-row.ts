import { DataDenInternalOptions } from '../../../data-den-options.interface';
import { createHtmlElement } from '../../../utils';
import { DataDenHeaderCell } from '../cell/data-den-header-cell';
import { DataDenRow } from './data-den-row';

export class DataDenHeaderRow extends DataDenRow {
  #options: DataDenInternalOptions;

  constructor(
    public index: number,
    public cellsLeft: DataDenHeaderCell[],
    public cells: DataDenHeaderCell[],
    public cellsRight: DataDenHeaderCell[],
    options: DataDenInternalOptions
  ) {
    super(index, cellsLeft, cells, cellsRight, options);
    this.#options = options;

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

    const leftCellsWidth = this.cellsLeft.reduce((acc, curr) => acc + curr.width, 0);
    const rightCellsWidth = this.cellsRight.reduce((acc, curr) => acc + curr.width, 0);

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

    this.cellsLeft.forEach((cell) => leftCellsWrapper.appendChild(cell.render()));
    this.cells.forEach((cell) => centerCellsWrapper.appendChild(cell.render()));
    this.cellsRight.forEach((cell) => rightCellsWrapper.appendChild(cell.render()));

    this.element.appendChild(cells);

    return this.element;
  }
}
