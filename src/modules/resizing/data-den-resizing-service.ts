import { Context } from '../../context';
import { DataDenEvent } from '../../data-den-event';
import { DataDenOptions } from '../../data-den-options.interface';
import { DataDenPubSub } from '../../data-den-pub-sub';

export class DataDenResizingService {
  #container: HTMLElement;
  #options: DataDenOptions;
  #isResizing: boolean;
  #headers: HTMLElement[];
  #defaultHeaders: HTMLElement[];
  #rows: HTMLElement[];
  #currentHeader: HTMLElement | null;
  #currentCol: HTMLElement[] | null;
  #currentColIndex: number;
  #headersOnTheRight: HTMLElement[];
  #columnsOrder: number[];

  constructor(container: HTMLElement, options: DataDenOptions) {
    this.#container = container;
    this.#options = options;
    this.#isResizing = false;
    this.#headers = Array.from(this.#container.querySelectorAll('[ref="headerCell"]') as NodeListOf<HTMLElement>);
    this.#columnsOrder = this.#headers.map((_, index) => index);
    this.#defaultHeaders = [...this.#headers];
    this.#rows = [];
    this.#currentHeader = null;
    this.#currentCol = null;
    this.#currentColIndex = -1;
    this.#headersOnTheRight = [];

    if (this.#options.resizable) {
      this.init();
    }
  }

  init() {
    this.#subscribeToEvents();
    this.#subscribeToDataChangeEvent();
  }

  #subscribeToEvents() {
    DataDenPubSub.subscribe('info:resizing:mousedown', (event) => this.#onMousedown(event));
    DataDenPubSub.subscribe('info:resizing:mouseup', () => this.#onMouseup());
    DataDenPubSub.subscribe('command:resizing:start', (event) => this.#onResizing(event));
    DataDenPubSub.subscribe('info:dragging:columns-reorder:done', (event: DataDenEvent) => {
      this.#columnsOrder = event.data.columnsOrder;
      this.#headers = this.#columnsOrder.map((columnIndex) => this.#defaultHeaders[columnIndex]);
    });
  }

  #subscribeToDataChangeEvent() {
    DataDenPubSub.subscribe('info:pagination:data-change:done', () => {
      this.#rows = Array.from(this.#container.querySelectorAll('[ref="row"]') as NodeListOf<HTMLElement>);
    });
  }

  #onMousedown(event: DataDenEvent) {
    this.#currentHeader = event.data.target.parentElement;
    this.#currentCol = this.#getColumnElements(this.#currentHeader);

    if (!this.#currentHeader || !this.#currentHeader.parentElement) {
      return;
    }

    this.#isResizing = true;
    this.#currentColIndex = this.#headers.indexOf(this.#currentHeader);
    this.#headersOnTheRight = this.#getHeadersOnTheRight();
  }

  #onMouseup() {
    if (!this.#isResizing) {
      return;
    }

    this.#isResizing = false;

    DataDenPubSub.publish('info:resizing:done', {
      context: new Context('info:resizing:done'),
    });
  }

  #onResizing(event: DataDenEvent) {
    if (!this.#isResizing || !this.#currentHeader) {
      return;
    }

    this.#resizeCurrentColumn(event.data.event.movementX);
    this.#updateRemainingColumnsPosition(event.data.event.movementX);

    DataDenPubSub.publish('info:resizing:start', {
      currentColIndex: this.#currentColIndex,
      newCurrentColWidth: parseInt(this.#currentHeader.style.width, 10),
      context: new Context('info:resizing:start'),
    });
  }

  #resizeCurrentColumn(movementX: number) {
    const currentWidth = this.#currentHeader?.style.width;
    const newWidth = parseInt(currentWidth || '0') + movementX;

    if (!this.#currentCol) {
      return;
    }

    this.#currentCol.forEach((cell) => (cell.style.width = `${newWidth}px`));
  }

  #updateRemainingColumnsPosition(movementX: number) {
    if (!this.#currentHeader) {
      return;
    }

    this.#headersOnTheRight.forEach((header) => {
      const currentLeft = header.style.left;
      const newLeft = parseInt(currentLeft || '0') + movementX;
      const col = this.#getColumnElements(header);
      col.forEach((cell) => (cell.style.left = `${newLeft}px`));
    });
  }

  #getHeadersOnTheRight(): HTMLElement[] {
    return this.#headers.slice(this.#currentColIndex + 1) as HTMLElement[];
  }

  #getColumnElements(colHeader: HTMLElement | null) {
    if (!colHeader || !colHeader.parentElement) {
      return [];
    }

    const index = this.#columnsOrder[this.#headers.indexOf(colHeader)];
    const colCells = this.#rows.map((row: HTMLElement) => row.querySelectorAll('[ref="cell"]')[index]) as HTMLElement[];

    return [colHeader, ...colCells];
  }
}
