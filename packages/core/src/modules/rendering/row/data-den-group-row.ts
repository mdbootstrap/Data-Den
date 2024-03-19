import { DataDenCell } from '../cell/data-den-cell';
import { createHtmlElement } from '../../../utils/dom';
import { DataDenInternalOptions } from '../../../data-den-options.interface';

export class DataDenGroupRow {
  element: HTMLElement;
  #options: DataDenInternalOptions;
  #parents: string[];
  #isExpanded: boolean = false;
  constructor(public index: number, public cells: DataDenCell[], options: DataDenInternalOptions, _group: string, _parents: string[], _numOfLevels: number) {
    this.#options = options;
    this.#parents = _parents.slice(0, _parents.length - 1).reverse();
    this.#isExpanded = _parents.length === 1;

    const groupIdentity = this.#parents.reverse().map((group) => {
      return `${group.toLowerCase().replace(/\//g, '_')}`;
    }).join('-');

    const isSubGroup = this.#parents.length > 0;

    const template =
      /* HTML */
      `<div class="${options.cssPrefix}row ${isSubGroup ? `${options.cssPrefix}group-${groupIdentity}` : ''}
      "role="row" ref="row" style="height: ${this.#isExpanded ? `${options.rowHeight}px` : '0px'}"></div>`;

    this.element = createHtmlElement(template);
    this.element.addEventListener('click', (e) => {
      // handle arrow rotation
      const groupRow = (e.target as HTMLElement).parentElement.parentElement;
      const arrow = groupRow.querySelector(`.${this.#options.cssPrefix}cell-icon`);
      arrow && arrow.classList.toggle(`${this.#options.cssPrefix}cell-icon-rotated`);
      // handle arrow rotation

      // handle group expansion
      const selector = _parents.map((group) => {
        return `${group.toLowerCase().replace(/\//g, '_')}`;
      }).join('-');

      const elems: HTMLElement[] = Array.from(document.querySelectorAll(`[class*=${options.cssPrefix}group-${selector}]`));

      elems.forEach((elem: HTMLElement) => {
        const height = elem.style.height;
        const isGroup = elem.classList.contains(`${options.cssPrefix}group-${selector}`);
        if (height === '0px') {
          elem.style.height = isGroup ? `${options.rowHeight}px` : height;
        } else {
          const arrows = [...elem.querySelectorAll(`.${this.#options.cssPrefix}cell-icon`)];
          arrows.forEach((arrow) => {
            arrow.classList.remove(`${this.#options.cssPrefix}cell-icon-rotated`);
          });
          elem.style.height = '0px';
        }
      });
      // handle group expansion
    })
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
