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
  #headersOnTheRight: HTMLElement[];
  #columnsOrder: number[];
  #isResizingPinnedRightColumn: boolean;
  readonly #columnMinWidth = 45;

  constructor(container: HTMLElement, options: DataDenInternalOptions, private PubSub: DataDenPubSub) {
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
    this.#headersOnTheRight = [];
    this.#isResizingPinnedRightColumn;

    this.#subscribeFetchDone();
    this.#subscribeRerenderingDone();
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
    this.PubSub.subscribe('info:fetch:done', () => {
      if (!this.#isInitiated) {
        this.init();
      }

      setTimeout(() => {
        this.#rows = Array.from(this.#container.querySelectorAll('[ref="row"]'));
      }, 0);
    });
  }

  #subscribeRerenderingDone(): void {
    this.PubSub.subscribe('command:rerendering:done', () => {
      this.#headers = Array.from(this.#container.querySelectorAll('[ref="headerCell"]'))!;
      this.#headersMain = Array.from(
        this.#container.querySelector('[ref="headerMainCellsWrapper"]').querySelectorAll('[ref="headerCell"]')
      )!;
      this.#columnsOrder = getAllColumnsOrder(this.#options.columns);
    });
  }

  #subscribeResizingEvents() {
    this.PubSub.subscribe('info:resizing:mousedown', this.#onMousedown.bind(this));
    document.addEventListener('mousemove', this.#onMousemove.bind(this));
    document.addEventListener('mouseup', this.#onMouseup.bind(this));
  }

  #subscribeDraggingEvent() {
    this.PubSub.subscribe('info:dragging:columns-reorder:done', (event: DataDenEvent) => {
      this.#columnsOrder = event.data.columnsOrder;
    });
  }

  #onMousedown(event: DataDenEvent) {
    this.#container.children[0].classList.add(`${this.#options.cssPrefix}resizing`);
    this.#currentHeader = event.data.target.parentElement;
    this.#currentCol = this.#getColumnElements(this.#currentHeader);
    this.#isResizingPinnedRightColumn = event.data.isPinnedRight;

    if (!this.#currentHeader || !this.#currentHeader.parentElement) {
      return;
    }

    this.#isResizing = true;
    this.#headersOnTheRight = this.#getHeadersOnTheRight();
  }

  #onMouseup() {
    this.#container.children[0].classList.remove(`${this.#options.cssPrefix}resizing`);
    if (!this.#isResizing) {
      return;
    }

    this.#isResizing = false;

    this.PubSub.publish('info:resizing:done', {
      context: new Context('info:resizing:done'),
    });
  }

  #onMousemove(event: MouseEvent) {
    if (!this.#isResizing || !this.#currentHeader || this.#currentCol.some((cell) => cell === undefined)) {
      this.#isResizing = false;
      return;
    }

    const movementX = this.#isResizingPinnedRightColumn ? -event.movementX : event.movementX;
    const currentWidth = this.#currentHeader?.style.width;
    const headerLeft = this.#currentHeader.querySelector(`.${this.#options.cssPrefix}header-resizer`);
    const newWidth = parseInt(currentWidth || '0') + movementX;

    if ((movementX > 0 && event.clientX < headerLeft.getClientRects()[0].left) || newWidth < this.#columnMinWidth)
      return;

    this.#resizeCurrentColumn(newWidth);
    this.#updateRemainingColumnsPosition(movementX);
    this.PubSub.publish('info:resizing:start', {
      currentColIndex: this.#headers.indexOf(this.#currentHeader),
      newCurrentColWidth: parseInt(this.#currentHeader.style.width, 10),
      context: new Context('info:resizing:start'),
    });
  }

  #resizeCurrentColumn(newWidth: number) {
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
    const currentHeaderLeft = parseInt(this.#currentHeader?.style.left || '0', 10);
    return this.#headersMain.filter((header) => parseInt(header.style.left || '0', 10) > currentHeaderLeft);
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
