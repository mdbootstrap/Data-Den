import { DataDenCell } from '../cell/data-den-cell';
import { createHtmlElement } from '../../../utils/dom';
import { DataDenInternalOptions } from '../../../data-den-options.interface';

export class DataDenRow {
  element: HTMLElement;
  #options: DataDenInternalOptions;

  constructor(public index: number, public cells: DataDenCell[], options: DataDenInternalOptions) {
    this.#options = options;
    const template =
      /* HTML */
      `<div class="${options.cssPrefix}row" role="row" ref="row" style="height: ${options.rowHeight}px;"></div>`;

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
      `<div
        class="${this.#options.cssPrefix}pinned-cells-wrapper ${this.#options.cssPrefix}pinned-cells-wrapper-left"
      ></div>`
    );
    const centerCellsWrapper = createHtmlElement(
      /* HTML */
      `<div
        class="${this.#options.cssPrefix}main-cells-wrapper"
        style="left: ${leftCellsWidth}px; width: calc(100% - ${leftCellsWidth + rightCellsWidth}px);"
        ref="rowMainCellsWrapper"
      ></div>`
    );
    const rightCellsWrapper = createHtmlElement(
      /* HTML */
      `<div
        class="${this.#options.cssPrefix}pinned-cells-wrapper ${this.#options.cssPrefix}pinned-cells-wrapper-right"
      ></div>`
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
