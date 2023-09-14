import { DataDenOptions } from '../../data-den-options.interface';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { Context } from '../../context';

export class DataDenDraggingService {
  #container: HTMLElement;
  #options: DataDenOptions;
  #isDragging: boolean;
  #headerRow: HTMLDivElement;
  #headers: HTMLDivElement[];
  #currentIndex: number;
  #targetIndex: number;
  #prevTargetIndex: number;
  #columns: HTMLElement[][];
  #columnPositions: { left: number; width: number }[];
  #breakpoints: number[];
  #columnsOrder: number[];
  #defaultGridOffsetLeft: number;

  #handleGridMouseMove: (e: MouseEvent) => void;
  #handleDocumentMouseUp: (e: MouseEvent) => void;
  #handleHeaderMouseDown: (e: MouseEvent) => void;

  constructor(container: HTMLElement, options: DataDenOptions) {
    this.#container = container;
    this.#options = options;
    this.#isDragging = false;
    this.#headerRow = this.#container.querySelector('[ref="headerRow"]') as HTMLDivElement;
    this.#headers = Array.from(this.#container.querySelectorAll('[ref="headerCell"]') as NodeListOf<HTMLDivElement>);
    this.#currentIndex = -1;
    this.#targetIndex = -1;
    this.#prevTargetIndex = -1;
    this.#columns = [];
    this.#columnPositions = [...this.#getAllColumnPositions()];
    this.#breakpoints = this.#columnPositions.map((column) => column.left);
    this.#columnsOrder = [];
    this.#defaultGridOffsetLeft = this.#headerRow.getBoundingClientRect().left;

    this.#handleGridMouseMove = () => {};
    this.#handleDocumentMouseUp = () => {};
    this.#handleHeaderMouseDown = () => {};

    if (this.#options.draggable) {
      this.init();
    }
  }

  init() {
    this.#addColumnDragEventHandlers();
    this.#setColumnsOrder();
    this.#subscribeToDataChangeEvent();
    this.#subscribeToResizingDone();
  }

  dispose() {
    this.#removeDraggableClass();
    this.#removeDocumentEventListeners();
  }

  #getOffsetX(pageX: number) {
    return pageX - this.#defaultGridOffsetLeft;
  }

  #getAllColumnPositions() {
    return this.#headers.map((column: HTMLDivElement) => ({
      left: parseFloat(column.style.left),
      width: parseFloat(column.style.width),
    }));
  }

  #getAllColumnElements() {
    return this.#headers.map((_: HTMLDivElement, key: number) => [...this.#getColumnElements(key)]);
  }

  #getColumnElements(index: number) {
    const colHeader = this.#headers[index];
    const rows = this.#container.querySelectorAll('[ref="row"]') as NodeListOf<HTMLDivElement>;
    const cells = Array.from(rows).map(
      (row: HTMLDivElement) => row.querySelectorAll('[ref="cell"]')[index]
    ) as HTMLDivElement[];

    return [colHeader, ...cells];
  }

  #addColumnDragEventHandlers() {
    this.#handleHeaderMouseDown = this.#onHeaderMouseDown.bind(this);
    this.#handleGridMouseMove = this.#onGridMouseMove.bind(this);
    this.#handleDocumentMouseUp = this.#onDocumentMouseUp.bind(this);

    this.#headerRow.addEventListener('mousedown', this.#handleHeaderMouseDown);
    this.#container.addEventListener('mousemove', this.#handleGridMouseMove);
    document.addEventListener('mouseup', this.#handleDocumentMouseUp);
  }

  #setColumnsOrder() {
    for (let i = 0; i < this.#options.columns.length; i++) {
      this.#columnsOrder.push(i);
    }
  }

  #subscribeToDataChangeEvent() {
    DataDenPubSub.subscribe('info:pagination:data-change:done', () => {
      const tempColumns = [...(this.#getAllColumnElements() as HTMLElement[][])];
      this.#columns = this.#columnsOrder.map((columnIndex) => tempColumns[columnIndex]);
    });
  }

  #subscribeToResizingDone() {
    DataDenPubSub.subscribe('info:resizing:done', () => {
      const orderedColumnPositions = [...this.#getAllColumnPositions()];
      this.#columnPositions = this.#columnsOrder.map((columnIndex) => orderedColumnPositions[columnIndex]);
      this.#breakpoints = this.#columnPositions.map((column) => column.left);
    });
  }

  #onHeaderMouseDown(event: MouseEvent) {
    event.stopPropagation();
    this.#onMouseDown(this.#getOffsetX(event.pageX));
  }

  #onMouseDown(offsetX: number) {
    this.#initializeDragging(offsetX);
    this.#enableTransition();
    this.#setActiveStyle();
  }

  #initializeDragging(offsetX: number) {
    this.#isDragging = true;
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

    // prevent swapping if there is no space for it (current column width is bigger than target column width)
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
        cell.classList.add('dragging');
      });
    });
  }

  #setActiveStyle() {
    this.#columns[this.#currentIndex].forEach((cell) => {
      cell.classList.add('active');
    });
  }

  #unsetActiveStyle() {
    this.#columns.forEach((column) => {
      column.forEach((cell) => {
        cell.classList.remove('active');
      });
    });
  }

  #disableTransition() {
    this.#columns.forEach((column) => {
      column.forEach((cell) => {
        cell.classList.remove('dragging');
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
      column.forEach((cell) => {
        cell.style.left = `${this.#breakpoints[index]}px`;
      });
    });
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
    this.#publishColumnsOrder();
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
    this.#headerRow.removeEventListener('mousedown', this.#handleHeaderMouseDown);
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
