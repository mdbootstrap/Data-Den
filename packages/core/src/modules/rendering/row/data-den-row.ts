import { DataDenCell } from '../cell/data-den-cell';
import { createHtmlElement } from '../../../utils/dom';
import { DataDenInternalOptions } from '../../../data-den-options.interface';

export class DataDenRow {
  element: HTMLElement;
  #options: DataDenInternalOptions;

  constructor(
    public index: number,
    public cellsLeft: DataDenCell[],
    public cells: DataDenCell[],
    public cellsRight: DataDenCell[],
    options: DataDenInternalOptions
  ) {
    this.#options = options;
    const template =
      /* HTML */
      `<div class="${options.cssPrefix}row" role="row" ref="row" style="height: ${options.rowHeight}px;"></div>`;

    this.element = createHtmlElement(template);
  }

  render(): HTMLElement {
    const cells = document.createDocumentFragment();

    const leftCellsWidth = this.cellsLeft
      .filter((cell) => cell !== undefined)
      .reduce((acc, curr) => acc + curr.width, 0);
    const rightCellsWidth = this.cellsRight
      .filter((cell) => cell !== undefined)
      .reduce((acc, curr) => acc + curr.width, 0);

    const leftCellsWrapper = createHtmlElement(
      /* HTML */
      `<div
        class="${this.#options.cssPrefix}left-cells-wrapper"
        style="width: ${leftCellsWidth}px; height: ${this.#options.rowHeight}px;"
      ></div>`
    );
    const centerCellsWrapper = createHtmlElement(
      /* HTML */
      `<div
        class="${this.#options.cssPrefix}main-cells-wrapper"
        style="left: ${leftCellsWidth}px; width: calc(100% - ${leftCellsWidth + rightCellsWidth}px); height: ${this
          .#options.rowHeight}px;"
        ref="rowMainCellsWrapper"
      ></div>`
    );
    const rightCellsWrapper = createHtmlElement(
      /* HTML */
      `<div
        class="${this.#options.cssPrefix}right-cells-wrapper"
        style="width: ${rightCellsWidth}px; height: ${this.#options.rowHeight}px"
      ></div>`
    );

    cells.appendChild(leftCellsWrapper);
    cells.appendChild(centerCellsWrapper);
    cells.appendChild(rightCellsWrapper);

    this.cellsLeft.filter((cell) => cell !== undefined).forEach((cell) => leftCellsWrapper.appendChild(cell.render()));
    this.cells.filter((cell) => cell !== undefined).forEach((cell) => centerCellsWrapper.appendChild(cell.render()));
    this.cellsRight
      .filter((cell) => cell !== undefined)
      .forEach((cell) => rightCellsWrapper.appendChild(cell.render()));

    this.element.appendChild(cells);

    return this.element;
  }
}
