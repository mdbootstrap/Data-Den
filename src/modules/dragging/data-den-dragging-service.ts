import { DataDenOptions } from '../../data-den-options.interface';
import { DataDenPubSub } from '../../data-den-pub-sub';

export class DataDenDraggingService {
  #container: HTMLElement;
  #options: DataDenOptions;
  #isDragging: boolean;
  #headers: HTMLDivElement[];
  #currentIndex: number;
  #targetIndex: number;
  #prevTargetIndex: number;
  #columns: HTMLElement[][];
  #columnPositions: { left: number; width: number }[];
  #columnsOrder: number[];
  #breakpoints: number[];

  #bindedGridMouseMove: (e: MouseEvent) => void;
  #bindedDocumentMouseUp: (e: MouseEvent) => void;
  #bindedHeaderMouseDownEvents: any[];

  constructor(container: HTMLElement, options: DataDenOptions) {
    this.#container = container;
    this.#options = options;
    this.#isDragging = false;
    this.#headers = Array.from(this.#container.querySelectorAll('.data-den-header-cell') as NodeListOf<HTMLDivElement>);
    this.#currentIndex = -1;
    this.#targetIndex = -1;
    this.#prevTargetIndex = -1;
    this.#columns = [];
    this.#columnPositions = [...this.#getAllColumnPositions()];
    this.#breakpoints = this.#columnPositions.map((column) => column.left);
    this.#columnsOrder = [];

    this.#bindedGridMouseMove = () => {};
    this.#bindedDocumentMouseUp = () => {};
    this.#bindedHeaderMouseDownEvents = [];

    if (this.#options.draggable) {
      this.#init();
    }
  }

  #init() {
    this.#addColumnDragEventHandlers();

    for (let i = 0; i < this.#options.columns.length; i++) {
      this.#columnsOrder.push(i);
    }

    DataDenPubSub.subscribe('info:pagination:data-change:done', () => {
      this.#columns = [...(this.#getAllColumnElements() as HTMLElement[][])];
    });
  }

  #getAllColumnPositions() {
    return this.#headers.map((column: HTMLDivElement) => {
      return {
        left: parseFloat(column.style.left),
        width: parseFloat(column.style.width),
      };
    });
  }

  #getAllColumnElements() {
    return this.#headers.map((_: HTMLDivElement, key: number) => [...this.#getColumnElements(key)]);
  }

  #getColumnElements(index: number) {
    const colHeader = this.#headers[index];
    const rows = this.#container.querySelectorAll('.data-den-row') as NodeListOf<HTMLDivElement>;
    const cells = Array.from(rows).map(
      (row: HTMLDivElement) => row.querySelectorAll('.data-den-cell')[index]
    ) as HTMLDivElement[];

    return [colHeader, ...cells];
  }

  #addColumnDragEventHandlers() {
    this.#addDragHandleEventListeners();

    this.#bindedGridMouseMove = this.#onGridMouseMove.bind(this);
    this.#bindedDocumentMouseUp = this.#handleDocumentMouseUp.bind(this);

    this.#container.addEventListener('mousemove', this.#bindedGridMouseMove);
    document.addEventListener('mouseup', this.#bindedDocumentMouseUp);
  }

  #handleHeaderMouseDown(event: MouseEvent) {
    event.stopPropagation();
    this.#handleMouseDown(event.pageX);
  }

  #addDragHandleEventListeners() {
    this.#headers.forEach((header: HTMLDivElement, index: number) => {
      this.#bindedHeaderMouseDownEvents[index] = this.#handleHeaderMouseDown.bind(this);
      header.addEventListener('mousedown', this.#bindedHeaderMouseDownEvents[index]);
    });
  }

  #handleMouseDown(pageX: number) {
    this.#initializeDragging(pageX);
    this.#enableTransition();
    this.#setActiveStyle();
  }

  #initializeDragging(pageX: number) {
    this.#isDragging = true;
    this.#currentIndex = this.#getMinBreakpointIndex(this.#breakpoints, pageX);
  }

  #onGridMouseMove(event: MouseEvent) {
    if (!this.#isDragging) {
      return;
    }

    this.#targetIndex = this.#getMinBreakpointIndex(this.#breakpoints, event.pageX);

    const currentColumnWidth = this.#columnPositions[this.#currentIndex].width;
    const targetColumnWidth = this.#columnPositions[this.#targetIndex].width;
    const gap = targetColumnWidth - currentColumnWidth;

    // prevent swapping if there is no space for it (current colmn width is bigger than target column width)
    if (
      (this.#getDirection() === 'right' && this.#breakpoints[this.#targetIndex] + gap > event.pageX) ||
      (this.#getDirection() === 'left' && this.#breakpoints[this.#targetIndex] + currentColumnWidth < event.pageX)
    ) {
      this.#targetIndex = this.#currentIndex;
      return;
    }

    if (this.#prevTargetIndex !== this.#targetIndex && this.#targetIndex !== -1) {
      this.#temporarilyUpdateColumnPositions();
      this.#prevTargetIndex = this.#targetIndex;
    }
  }

  #handleDocumentMouseUp() {
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

  #temporarilyUpdateColumnPositions() {
    if (this.#targetIndex === -1) {
      return;
    }

    const direction = this.#getDirection();

    if (this.#currentIndex === this.#targetIndex && this.#prevTargetIndex === -1) {
      return;
    }

    let currentTempIndex;

    if (direction === 'right') {
      currentTempIndex = this.#targetIndex - 1;
    } else {
      currentTempIndex = this.#targetIndex + 1;
    }

    const currentColumnWidth = this.#columnPositions[currentTempIndex].width;
    const targetColumnWidth = this.#columnPositions[this.#targetIndex].width;
    const gap = targetColumnWidth - currentColumnWidth;

    if (direction === 'right') {
      this.#breakpoints[this.#targetIndex] = this.#breakpoints[this.#targetIndex] + gap;
      this.#swapArrayElements(this.#columnPositions, currentTempIndex, this.#targetIndex);
    } else {
      this.#breakpoints[this.#targetIndex + 1] = this.#breakpoints[this.#targetIndex + 1] - gap;
      this.#swapArrayElements(this.#columnPositions, currentTempIndex, this.#targetIndex);
    }

    this.#swapArrayElements(this.#columns, currentTempIndex, this.#targetIndex);
    this.#swapArrayElements(this.#columnsOrder, currentTempIndex, this.#targetIndex);

    this.#columns.forEach((column, index) => {
      column.forEach((cell) => {
        cell.style.left = `${this.#breakpoints[index]}px`;
      });
    });
  }

  #getDirection() {
    if (this.#prevTargetIndex > this.#targetIndex) {
      return 'left';
    }

    return 'right';
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

    console.log(this.#columnsOrder);
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
    this.#container.removeEventListener('mousemove', this.#bindedGridMouseMove);
    document.removeEventListener('mouseup', this.#bindedDocumentMouseUp);

    const headers = this.#container.querySelectorAll('.data-den-header-cell') as NodeListOf<HTMLDivElement>;

    headers.forEach((header: HTMLDivElement, index: number) => {
      header.removeEventListener('mousedown', this.#bindedHeaderMouseDownEvents[index]);
    });
  }

  dispose() {
    this.#removeDraggableClass();
    this.#removeDocumentEventListeners();
  }
}
