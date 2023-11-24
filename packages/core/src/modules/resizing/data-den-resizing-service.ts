import { Context } from '../../context';
import { DataDenEvent } from '../../data-den-event';
import { DataDenInternalOptions } from '../../data-den-options.interface';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { getAllColumnsOrder } from '../../utils/columns-order';

export class DataDenResizingService {
  #container: HTMLElement;
  #options: DataDenInternalOptions;
  #isInitiated: boolean;
  #isResizing: boolean;
  #headers: HTMLElement[];
  #headersMain: HTMLElement[];
  #rows: HTMLElement[];
  #currentHeader: HTMLElement | null;
  #currentCol: HTMLElement[] | null;
  #currentColIndex: number;
  #headersOnTheRight: HTMLElement[];
  #columnsOrder: number[];

  constructor(container: HTMLElement, options: DataDenInternalOptions) {
    this.#container = container;
    this.#options = options;
    this.#isInitiated = false;
    this.#isResizing = false;
    this.#headers = [];
    this.#headersMain = [];
    this.#columnsOrder = [];
    this.#rows = [];
    this.#currentHeader = null;
    this.#currentCol = null;
    this.#currentColIndex = -1;
    this.#headersOnTheRight = [];

    this.#subscribeFetchDone();
  }

  init() {
    this.#headers = Array.from(this.#container.querySelectorAll('[ref="headerCell"]'))!;
    this.#headersMain = Array.from(
      this.#container.querySelector('[ref="headerMainCellsWrapper"]').querySelectorAll('[ref="headerCell"]')
    )!;
    this.#columnsOrder = getAllColumnsOrder(this.#options.columns);

    this.#subscribeResizingEvents();
    this.#subscribeDraggingEvent();
    this.#isInitiated = true;
  }

  #subscribeFetchDone(): void {
    DataDenPubSub.subscribe('info:fetch:done', () => {
      if (!this.#isInitiated) {
        this.init();
      }

      this.#rows = Array.from(this.#container.querySelectorAll('[ref="row"]'));
    });
  }

  #subscribeResizingEvents() {
    DataDenPubSub.subscribe('info:resizing:mousedown', (event) => this.#onMousedown(event));
    DataDenPubSub.subscribe('info:resizing:mouseup', () => this.#onMouseup());
    DataDenPubSub.subscribe('command:resizing:start', (event) => this.#onResizing(event));
  }

  #subscribeDraggingEvent() {
    DataDenPubSub.subscribe('info:dragging:columns-reorder:done', (event: DataDenEvent) => {
      this.#columnsOrder = event.data.columnsOrder;
    });
  }

  #onMousedown(event: DataDenEvent) {
    this.#currentHeader = event.data.target.parentElement;
    this.#currentCol = this.#getColumnElements(this.#currentHeader);

    if (!this.#currentHeader || !this.#currentHeader.parentElement) {
      return;
    }

    this.#isResizing = true;
    this.#currentColIndex = this.#headersMain.indexOf(this.#currentHeader);
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
      currentColIndex: this.#headers.indexOf(this.#currentHeader),
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
      // prevent right pinned columns from moving
      if (currentLeft === 'auto') {
        return;
      }
      const newLeft = parseInt(currentLeft || '0') + movementX;
      const col = this.#getColumnElements(header);
      col.forEach((cell: HTMLElement) => (cell.style.left = `${newLeft}px`));
    });
  }

  #getHeadersOnTheRight(): HTMLElement[] {
    if (this.#currentColIndex === -1) {
      return [];
    }
    return this.#headersMain.slice(this.#currentColIndex + 1);
  }

  #getColumnElements(colHeader: HTMLElement | null): HTMLElement[] {
    if (!colHeader || !colHeader.parentElement) {
      return [];
    }

    const colHeaderIndex = this.#headers.indexOf(colHeader);
    const colCells = this.#rows.map(
      (row: HTMLElement) => row.querySelectorAll('[ref="cell"]')[colHeaderIndex] as HTMLElement
    );

    return [colHeader, ...colCells];
  }
}
