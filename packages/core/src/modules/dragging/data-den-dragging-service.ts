import { DataDenInternalOptions } from '../../data-den-options.interface';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { Context } from '../../context';
import { getMainColumnsOrder } from '../../utils/columns-order';

export class DataDenDraggingService {
  #container: HTMLElement;
  #gridMain: HTMLElement;
  #options: DataDenInternalOptions;
  #isInitiated: boolean;
  #isDragging: boolean;
  #headerMainCellsWrapper: HTMLElement | null;
  #headers: HTMLElement[];
  #currentIndex: number;
  #targetIndex: number;
  #prevTargetIndex: number;
  #columns: HTMLElement[][];
  #columnPositions: { left: string; width: number }[];
  #breakpoints: number[];
  #mainColumnsOrder: number[];
  #defaultGridOffsetLeft: number;
  #cssPrefix: string;

  #handleGridMouseMove: (e: MouseEvent) => void;
  #handleDocumentMouseUp: (e: MouseEvent) => void;
  #handleHeaderMouseDown: (e: MouseEvent) => void;

  constructor(container: HTMLElement, options: DataDenInternalOptions, private PubSub: DataDenPubSub) {
    this.#container = container;
    this.#gridMain = container.querySelector('[ref="gridMain"]')!;
    this.#options = options;
    this.#isInitiated = false;
    this.#isDragging = false;
    this.#headerMainCellsWrapper = null;
    this.#headers = [];
    this.#currentIndex = -1;
    this.#targetIndex = -1;
    this.#prevTargetIndex = -1;
    this.#columns = [];
    this.#columnPositions = [];
    this.#breakpoints = [];
    this.#mainColumnsOrder = [];
    this.#defaultGridOffsetLeft = 0;
    this.#cssPrefix = options.cssPrefix;

    this.#handleGridMouseMove = () => {};
    this.#handleDocumentMouseUp = () => {};
    this.#handleHeaderMouseDown = () => {};

    this.#subscribeFetchDone();
    this.#subscribeRerenderingDone();
  }

  init() {
    this.#setDefaultColumnsOrder();
    this.#setHeaderElements();
    this.update();
    this.#setColumnParams();
    this.#addColumnDragEventHandlers();
    this.#subscribeResizingDone();

    this.#isInitiated = true;
  }

  dispose() {
    this.#removeDraggableClass();
    this.#removeDocumentEventListeners();
  }

  update() {
    const tempColumns = [...this.#getAllColumnElements()];
    this.#columns = this.#mainColumnsOrder.map((columnIndex) => tempColumns[columnIndex]);
  }

  #subscribeFetchDone() {
    this.PubSub.subscribe('info:fetch:done', () => {
      if (this.#isInitiated) {
        this.update();
      } else {
        this.init();
      }
    });
  }

  #subscribeRerenderingDone() {
    this.PubSub.subscribe('command:rerendering:done', () => {
      this.#setDefaultColumnsOrder();
      this.#setHeaderElements();

      setTimeout(() => {
        this.#gridMain = this.#container.querySelector('[ref="gridMain"]')!;
        this.update();
        this.#setColumnParams();
        this.#addColumnDragEventHandlers();
      }, 0);
    });
  }

  #setHeaderElements() {
    this.#headerMainCellsWrapper = this.#container.querySelector('[ref="headerMainCellsWrapper"]')!;
    this.#headers = Array.from(this.#headerMainCellsWrapper.querySelectorAll('[ref="headerCell"]'))!;
  }

  #setColumnParams() {
    this.#columnPositions = [...this.#getAllColumnPositions()];
    this.#setBreakpoints();
    this.#defaultGridOffsetLeft =
      this.#gridMain!.getBoundingClientRect().left + parseFloat(this.#headerMainCellsWrapper!.style.left);
  }

  #setBreakpoints() {
    this.#breakpoints = [];
    this.#columnPositions.forEach((column) => {
      if (column.left === 'auto') {
        return;
      }

      this.#breakpoints.push(parseFloat(column.left));
    });
    this.#breakpoints.sort((a, b) => a - b);
  }

  #getOffsetX(pageX: number) {
    return pageX - this.#defaultGridOffsetLeft + this.#gridMain.scrollLeft;
  }

  #getAllColumnPositions() {
    return this.#headers.map((column: HTMLElement) => ({
      left: column.style.left,
      width: parseFloat(column.style.width),
    }));
  }

  #getAllColumnElements() {
    return this.#headers.map((_: HTMLElement, key: number) => [...this.#getColumnElements(key)]);
  }

  #getColumnElements(index: number) {
    const colHeader = this.#headers[index];
    const rows = this.#container.querySelectorAll('[ref="row"]');
    const cells = Array.from(rows).map(
      (row) => row.querySelectorAll('.data-den-main-cells-wrapper [ref="cell"]')[index] as HTMLElement
    );

    return [colHeader, ...cells];
  }

  #addColumnDragEventHandlers() {
    this.#handleHeaderMouseDown = this.#onHeaderMouseDown.bind(this);
    this.#handleGridMouseMove = this.#onGridMouseMove.bind(this);
    this.#handleDocumentMouseUp = this.#onDocumentMouseUp.bind(this);

    this.#headerMainCellsWrapper!.addEventListener('mousedown', this.#handleHeaderMouseDown);
    this.#container.addEventListener('mousemove', this.#handleGridMouseMove);
    document.addEventListener('mouseup', this.#handleDocumentMouseUp);
  }

  #setDefaultColumnsOrder() {
    this.#mainColumnsOrder = getMainColumnsOrder(this.#options.columns);
  }

  #subscribeResizingDone() {
    this.PubSub.subscribe('info:resizing:done', () => {
      const orderedColumnPositions = [...this.#getAllColumnPositions()];
      this.#columnPositions = this.#mainColumnsOrder.map((columnIndex) => orderedColumnPositions[columnIndex]);
      this.#setBreakpoints();
      this.#defaultGridOffsetLeft =
        this.#gridMain!.getBoundingClientRect().left + parseFloat(this.#headerMainCellsWrapper!.style.left);
    });
  }

  #onHeaderMouseDown(event: MouseEvent) {
    event.stopPropagation();
    const target = event.target as HTMLElement;

    if (event.button !== 0 || target.getAttribute('ref') !== 'headerCell') {
      return;
    }

    this.#onMouseDown(this.#getOffsetX(event.pageX));
  }

  #onMouseDown(offsetX: number) {
    this.#getCurrentIndex(offsetX);
    this.#isDragging = true;
    this.#enableTransition();
    this.#setActiveStyle();
  }

  #getCurrentIndex(offsetX: number) {
    this.#currentIndex = this.#getMinBreakpointIndex(this.#breakpoints, offsetX);
  }

  #onGridMouseMove(event: MouseEvent) {
    if (!this.#isDragging) {
      return;
    }

    const offsetX = this.#getOffsetX(event.pageX);
    this.#targetIndex = this.#getMinBreakpointIndex(this.#breakpoints, offsetX);

    const currentColumnWidth = this.#columnPositions[this.#currentIndex].width;
    const gap = this.#getColumnsGap(this.#currentIndex);

    // prevent swapping if there is no space for it (current column is wider than target column)
    if (
      (this.#getDirection() === 'right' && this.#breakpoints[this.#targetIndex] + gap > offsetX) ||
      (this.#getDirection() === 'left' && this.#breakpoints[this.#targetIndex] + currentColumnWidth < offsetX)
    ) {
      this.#targetIndex = this.#currentIndex;
      return;
    }

    if (this.#prevTargetIndex !== this.#targetIndex && this.#targetIndex !== -1) {
      this.#updateColumnPositions();
      this.#prevTargetIndex = this.#targetIndex;
    }
  }

  #onDocumentMouseUp() {
    if (!this.#isDragging) {
      return;
    }

    this.#finalizeDragging();
  }

  #enableTransition() {
    this.#columns.forEach((column) => {
      column.forEach((cell) => {
        cell.classList.add(`${this.#cssPrefix}dragging`);
      });
    });
  }

  #setActiveStyle() {
    this.#container.children[0].classList.add(`${this.#options.cssPrefix}dragging`);
    this.#columns[this.#currentIndex].forEach((cell) => {
      cell.classList.add(`${this.#cssPrefix}active`);
    });
  }

  #unsetActiveStyle() {
    this.#container.children[0].classList.remove(`${this.#options.cssPrefix}dragging`);
    this.#columns.forEach((column) => {
      column.forEach((cell) => {
        cell.classList.remove(`${this.#cssPrefix}active`);
      });
    });
  }

  #disableTransition() {
    this.#columns.forEach((column) => {
      column.forEach((cell) => {
        cell.classList.remove(`${this.#cssPrefix}dragging`);
      });
    });
  }

  #getMinBreakpointIndex(array: number[], value: number): number {
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] < value && array[i + 1] >= value) {
        return i;
      }
    }
    return array.length - 1;
  }

  #updateColumnPositions() {
    if (this.#currentIndex === this.#targetIndex && this.#prevTargetIndex === -1) {
      return;
    }

    const direction = this.#getDirection();
    const currentOrderedIndex = direction === 'right' ? this.#targetIndex - 1 : this.#targetIndex + 1;
    const gap = this.#getColumnsGap(currentOrderedIndex);

    if (direction === 'right') {
      this.#breakpoints[this.#targetIndex] = this.#breakpoints[this.#targetIndex] + gap;
    } else {
      this.#breakpoints[this.#targetIndex + 1] = this.#breakpoints[this.#targetIndex + 1] - gap;
    }

    this.#swapArrayElements(this.#columnPositions, currentOrderedIndex, this.#targetIndex);
    this.#swapArrayElements(this.#columns, currentOrderedIndex, this.#targetIndex);
    this.#swapArrayElements(this.#mainColumnsOrder, currentOrderedIndex, this.#targetIndex);

    this.#columns.forEach((column, index) => {
      column.forEach((cell) => {
        cell.style.left = `${this.#breakpoints[index]}px`;
      });
    });

    this.#publishColumnsOrder();
  }

  #getDirection() {
    return this.#prevTargetIndex > this.#targetIndex ? 'left' : 'right';
  }

  #getColumnsGap(sourceIndex: number) {
    const sourceColumnWidth = this.#columnPositions[sourceIndex].width;
    const targetColumnWidth = this.#columnPositions[this.#targetIndex].width;
    return targetColumnWidth - sourceColumnWidth;
  }

  #swapArrayElements(array: HTMLElement[][] | any[], sourceIndex: number, targetIndex: number) {
    if (sourceIndex === -1) {
      return;
    }

    const temp = array[sourceIndex];
    array[sourceIndex] = array[targetIndex];
    array[targetIndex] = temp;
  }

  #finalizeDragging() {
    this.#isDragging = false;
    this.#disableTransition();
    this.#unsetActiveStyle();
    this.#resetIndexes();
  }

  #resetIndexes() {
    this.#currentIndex = -1;
    this.#targetIndex = -1;
    this.#prevTargetIndex = -1;
  }

  #removeDraggableClass() {
    this.#headers.forEach((header) => {
      header.classList.remove('data-den-header-cell-draggable');
    });
  }

  #removeDocumentEventListeners() {
    this.#headerMainCellsWrapper!.removeEventListener('mousedown', this.#handleHeaderMouseDown);
    this.#container.removeEventListener('mousemove', this.#handleGridMouseMove);
    document.removeEventListener('mouseup', this.#handleDocumentMouseUp);
  }

  #publishColumnsOrder() {
    this.PubSub.publish('info:dragging:columns-reorder:done', {
      columnsOrder: this.#mainColumnsOrder,
      context: new Context('info:dragging:columns-reorder:done'),
    });
  }
}
