import { DataDenInternalOptions } from '../../data-den-options.interface';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { Context } from '../../context';
import { getColumnsOrder } from '../../utils/columns-order';

export class DataDenDraggingService {
  #container: HTMLElement;
  #gridMain: HTMLElement;
  #options: DataDenInternalOptions;
  #isInitiated: boolean;
  #isDragging: boolean;
  #headerRow: HTMLElement | null;
  #headers: HTMLElement[];
  #currentIndex: number;
  #targetIndex: number;
  #prevTargetIndex: number;
  #columns: HTMLElement[][];
  #columnPositions: { left: number; right: string; width: number }[];
  #breakpoints: number[];
  #columnsOrder: number[];
  #defaultGridOffsetLeft: number;
  #cssPrefix: string;

  #handleGridMouseMove: (e: MouseEvent) => void;
  #handleDocumentMouseUp: (e: MouseEvent) => void;
  #handleHeaderMouseDown: (e: MouseEvent) => void;

  constructor(container: HTMLElement, options: DataDenInternalOptions) {
    this.#container = container;
    this.#gridMain = container.querySelector('[ref="gridMain"]')!;
    this.#options = options;
    this.#isInitiated = false;
    this.#isDragging = false;
    this.#headerRow = null;
    this.#headers = [];
    this.#currentIndex = -1;
    this.#targetIndex = -1;
    this.#prevTargetIndex = -1;
    this.#columns = [];
    this.#columnPositions = [];
    this.#breakpoints = [];
    this.#columnsOrder = [];
    this.#defaultGridOffsetLeft = 0;
    this.#cssPrefix = options.cssPrefix;

    this.#handleGridMouseMove = () => {};
    this.#handleDocumentMouseUp = () => {};
    this.#handleHeaderMouseDown = () => {};

    if (this.#options.draggable) {
      this.#subscribeFetchDone();
    }
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
    this.#columns = this.#columnsOrder.map((columnIndex) => tempColumns[columnIndex]);
  }

  #subscribeFetchDone() {
    DataDenPubSub.subscribe('info:fetch:done', () => {
      if (this.#isInitiated) {
        this.update();
      } else {
        this.init();
      }
    });
  }

  #setHeaderElements() {
    this.#headerRow = this.#container.querySelector('[ref="headerRow"]')!;
    this.#headers = Array.from(this.#container.querySelectorAll('[ref="headerCell"]'))!;
  }

  #setColumnParams() {
    const orderedColumnPositions = [...this.#getAllColumnPositions()];
    this.#columnPositions = this.#columnsOrder.map((columnIndex) => orderedColumnPositions[columnIndex]);
    this.#setBreakpoints();
    this.#defaultGridOffsetLeft = this.#headerRow!.getBoundingClientRect().left;
  }

  #setBreakpoints() {
    this.#breakpoints = this.#columnPositions.map((column, index) => {
      let breakpoint = column.left;

      // right pinned column case
      if (column.right !== 'auto') {
        breakpoint = this.#columnPositions.slice(0, index).reduce((acc, curr) => acc + curr.width, 0);
      }

      return breakpoint;
    });
  }

  #getOffsetX(pageX: number) {
    return pageX - this.#defaultGridOffsetLeft + this.#gridMain.scrollLeft;
  }

  #getAllColumnPositions() {
    return this.#headers.map((column: HTMLElement) => ({
      left: parseFloat(column.style.left),
      right: column.style.right,
      width: parseFloat(column.style.width),
    }));
  }

  #getAllColumnElements() {
    return this.#headers.map((_: HTMLElement, key: number) => [...this.#getColumnElements(key)]);
  }

  #getColumnElements(index: number) {
    const colHeader = this.#headers[index];
    const rows = this.#container.querySelectorAll('[ref="row"]');
    const cells = Array.from(rows).map((row) => row.querySelectorAll('[ref="cell"]')[index] as HTMLElement);

    return [colHeader, ...cells];
  }

  #addColumnDragEventHandlers() {
    this.#handleHeaderMouseDown = this.#onHeaderMouseDown.bind(this);
    this.#handleGridMouseMove = this.#onGridMouseMove.bind(this);
    this.#handleDocumentMouseUp = this.#onDocumentMouseUp.bind(this);

    this.#headerRow!.addEventListener('mousedown', this.#handleHeaderMouseDown);
    this.#container.addEventListener('mousemove', this.#handleGridMouseMove);
    document.addEventListener('mouseup', this.#handleDocumentMouseUp);
  }

  #setDefaultColumnsOrder() {
    this.#columnsOrder = getColumnsOrder(this.#options.columns);
  }

  #subscribeResizingDone() {
    DataDenPubSub.subscribe('info:resizing:done', () => {
      const orderedColumnPositions = [...this.#getAllColumnPositions()];
      this.#columnPositions = this.#columnsOrder.map((columnIndex) => orderedColumnPositions[columnIndex]);
      this.#setBreakpoints();
    });
  }

  #onHeaderMouseDown(event: MouseEvent) {
    event.stopPropagation();
    this.#onMouseDown(this.#getOffsetX(event.pageX));
  }

  #onMouseDown(offsetX: number) {
    this.#getCurrentIndex(offsetX);
    // prevent dragging if the column is fixed
    if (this.#options.columns[this.#columnsOrder[this.#currentIndex]].fixed) {
      this.#isDragging = false;
      return;
    } else {
      this.#isDragging = true;
    }
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

    // prevent swapping if the column is fixed
    if (this.#options.columns[this.#columnsOrder[this.#targetIndex]].fixed) {
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
    this.#columns[this.#currentIndex].forEach((cell) => {
      cell.classList.add(`${this.#cssPrefix}active`);
    });
  }

  #unsetActiveStyle() {
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
    this.#swapArrayElements(this.#columnsOrder, currentOrderedIndex, this.#targetIndex);

    this.#columns.forEach((column, index) => {
      if (this.#options.columns[this.#columnsOrder[index]].fixed) {
        return;
      }
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
    this.#headerRow!.removeEventListener('mousedown', this.#handleHeaderMouseDown);
    this.#container.removeEventListener('mousemove', this.#handleGridMouseMove);
    document.removeEventListener('mouseup', this.#handleDocumentMouseUp);
  }

  #publishColumnsOrder() {
    DataDenPubSub.publish('info:dragging:columns-reorder:done', {
      columnsOrder: this.#columnsOrder,
      context: new Context('info:dragging:columns-reorder:done'),
    });
  }
}
