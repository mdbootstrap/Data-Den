import { DataDenColDef, DataDenInternalOptions } from '../../data-den-options.interface';
import { DataDenCell, DataDenHeaderCell } from './cell';
import { DataDenPaginationRenderer } from './pagination';
import { DataDenHeaderRow, DataDenRow } from './row';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { DataDenEvent } from '../../data-den-event';
import { DataDenSortOrder } from '../sorting/data-den-sorting.interface';
import { Context } from '../../context';
import {
  getMainColumnIndexes,
  getMainOrderedColumns,
  getPinnedLeftColumns,
  getMainColumns,
  getPinnedRightColumns,
  getAllColumnsOrder,
} from '../../utils/columns-order';
import { DataDenPinningPreviousState } from '../pinning/data-den-pinning-previous-state';
import { DataDenEventEmitter } from '../../data-den-event-emitter';

export class DataDenRenderingService {
  #container: HTMLElement;
  #options: DataDenInternalOptions;
  #orderedColumns: DataDenColDef[];
  #defaultOrderedColumns: DataDenColDef[];
  #columnsOrder: number[];
  #headerRow: DataDenHeaderRow;
  #rows: DataDenRow[] = [];
  #paginationRenderer: DataDenPaginationRenderer | null = null;
  #containerHeight: number;
  #header: HTMLElement;
  #body: HTMLElement;
  #gridMain: HTMLElement;
  #headerMainCellsWrapper: HTMLElement;
  #paginationContent: HTMLElement;

  constructor(container: HTMLElement, options: DataDenInternalOptions, private PubSub: DataDenPubSub) {
    this.#container = container;
    this.#containerHeight = 0;
    this.#options = options;
    this.#header = null;
    this.#body = null;
    this.#gridMain = null;
    this.#headerMainCellsWrapper = null;
    this.#paginationContent = null;

    if (options.pagination) {
      this.#paginationRenderer = new DataDenPaginationRenderer(options.paginationOptions, this.PubSub);
    }

    this.#init();
    this.#subscribeToEvents();
    this.#subscribeFetchDone();
    this.#publishFetchStart();
  }

  #init() {
    this.#orderedColumns = getMainOrderedColumns(this.#options.columns);
    this.#defaultOrderedColumns = getMainOrderedColumns(this.#options.columns);
    this.#columnsOrder = getMainColumnIndexes(this.#options.columns);
    this.#headerRow = this.#createHeaderRow(this.#options.columns, '');

    this.renderTable();
  }

  #createPinnedHeaderCells(
    pinnedColumnsDefs: DataDenColDef[],
    rowIndex: number,
    order: DataDenSortOrder
  ): DataDenHeaderCell[] {
    return pinnedColumnsDefs.map((colDef) => {
      const value = colDef.headerName;
      const left = 0;
      const width = colDef.width || 120;
      const colIndex = this.#options.columns.map((defaultColumn) => defaultColumn.field).indexOf(colDef.field);

      return new DataDenHeaderCell(
        value,
        colIndex,
        rowIndex,
        left,
        width,
        colDef.pinned,
        this.#options,
        order,
        this.PubSub
      );
    });
  }

  #createMainHeaderCells(
    mainColumnsDefs: DataDenColDef[],
    rowIndex: number,
    order: DataDenSortOrder
  ): DataDenHeaderCell[] {
    return mainColumnsDefs.map((colDef, index) => {
      const value = colDef.headerName;
      const left = this.#orderedColumns.slice(0, index).reduce((acc, curr) => acc + (curr.width || 120), 0);
      const width = this.#orderedColumns[index].width || 120;
      const colIndex = this.#options.columns.map((defaultColumn) => defaultColumn.field).indexOf(colDef.field);

      return new DataDenHeaderCell(
        value,
        colIndex,
        rowIndex,
        left,
        width,
        colDef.pinned,
        this.#options,
        order,
        this.PubSub
      );
    });
  }

  #createHeaderRow(colDefs: DataDenColDef[], order: DataDenSortOrder): DataDenHeaderRow {
    const rowIndex = 0;

    const pinnedHeaderCellsLeft = this.#createPinnedHeaderCells(getPinnedLeftColumns(colDefs), rowIndex, order);
    const mainHeaderCells = this.#createMainHeaderCells(getMainColumns(colDefs), rowIndex, order);
    const pinnedHeaderCellsRight = this.#createPinnedHeaderCells(
      getPinnedRightColumns(colDefs).reverse(),
      rowIndex,
      order
    );

    const headerCells = [...pinnedHeaderCellsLeft, ...mainHeaderCells, ...pinnedHeaderCellsRight];

    return new DataDenHeaderRow(rowIndex, headerCells, this.#options);
  }

  #createPinnedCellsLeft(key: string, value: any, colIndex: number, rowIndex: number): DataDenCell | undefined {
    const colDef = this.#options.columns.find((col) => col.field === key)!;
    if (colDef.pinned !== 'left') {
      return undefined;
    }

    const left = 0;
    const width = this.#options.columns[colIndex].width || 120;

    return new DataDenCell(value, colIndex, rowIndex, left, width, colDef.pinned, this.#options);
  }

  #createMainCells(key: string, value: any, colIndex: number, rowIndex: number): DataDenCell | undefined {
    const colDef = this.#options.columns.find((col) => col.field === key)!;
    if (colDef.pinned) {
      return undefined;
    }

    const orderedColIndex = this.#orderedColumns.findIndex((col) => col.field === key);
    const left = this.#orderedColumns.slice(0, orderedColIndex).reduce((acc, curr) => acc + (curr.width || 120), 0);
    const width = this.#orderedColumns[orderedColIndex].width || 120;

    return new DataDenCell(value, colIndex, rowIndex, left, width, colDef.pinned, this.#options);
  }

  #createPinnedCellsRight(key: string, value: any, colIndex: number, rowIndex: number): DataDenCell | undefined {
    const colDef = this.#options.columns.find((col) => col.field === key)!;
    if (colDef.pinned !== 'right') {
      return undefined;
    }

    const pinnedColIndex = this.#options.columns
      .filter((col) => col.pinned === 'right')
      .map((defaultColumn) => defaultColumn.field)
      .indexOf(key);

    const left = 0;
    const width = getPinnedRightColumns(this.#options.columns)[pinnedColIndex].width || 120;

    return new DataDenCell(value, colIndex, rowIndex, left, width, colDef.pinned, this.#options);
  }

  #createDataRows(rowsData: any): DataDenRow[] {
    return rowsData.map((rowData: any, rowIndex: number) => {
      const pinnedCellsLeft = Object.entries(rowData).map(([key, value], colIndex) =>
        this.#createPinnedCellsLeft(key, value, colIndex, rowIndex)
      );
      const mainCells = Object.entries(rowData);
      mainCells.sort(([aField], [bField]) => {
        // sort based on this.#orderedColumns order
        const aIndex = this.#orderedColumns.findIndex((col) => col.field === aField);
        const bIndex = this.#orderedColumns.findIndex((col) => col.field === bField);
        return aIndex - bIndex;
      });
      const mainCellsSorted = mainCells.map<DataDenCell>(([key, value], colIndex) =>
        this.#createMainCells(key, value, colIndex, rowIndex)
      );

      const pinnedCellsRight = Object.entries(rowData)
        .reverse()
        .map(([key, value], colIndex) => this.#createPinnedCellsRight(key, value, colIndex, rowIndex));

      const cells = [...pinnedCellsLeft, ...mainCellsSorted, ...pinnedCellsRight].filter((cell) => cell !== undefined);

      return new DataDenRow(rowIndex, cells, this.#options);
    });
  }

  #publishFetchStart() {
    this.PubSub.publish('command:fetch:start', {
      caller: this,
      context: new Context('command:fetch:start'),
    });
  }

  renderTable(): void {
    const grid = this.#renderGrid();

    this.#gridMain = document.createElement('div');
    this.#gridMain.setAttribute('ref', 'gridMain');
    this.#gridMain.classList.add(`${this.#options.cssPrefix}grid-main`);

    this.#gridMain.appendChild(this.#renderHeader());
    this.#gridMain.appendChild(this.#renderBody());
    grid.appendChild(this.#gridMain);

    if (this.#paginationRenderer) {
      grid.appendChild(this.#paginationRenderer.getGui());
    }

    this.#container.appendChild(grid);
    this.#containerHeight = this.#container.clientHeight;

    this.#setElements();
    this.#calculateGridSize();
  }

  rerenderTable(): void {
    this.#container.innerHTML = '';

    this.#init();
    this.#publishFetchStart();

    this.PubSub.publish('command:rerendering:done', {
      caller: this,
      context: new Context('command:rerendering:done'),
    });
    this.PubSub.publish('command:rerendering:done', {
      caller: this,
      context: new Context('command:rerendering:done'),
    });
  }

  #setElements(): void {
    this.#header = this.#container.querySelector(`.${this.#options.cssPrefix}header`);
    this.#body = this.#container.querySelector(`.${this.#options.cssPrefix}grid-rows`);
    this.#headerMainCellsWrapper = this.#container.querySelector('[ref=headerMainCellsWrapper]');
    this.#paginationContent = this.#container.querySelector('[ref=paginationContent]');
  }

  #calculateGridSize(): void {
    this.#calculateGridWidth();
    this.#calculateGridHeight();
  }

  #calculateGridHeight(): void {
    // do not calculate the grid size if there are no rows
    if (!this.#rows.length) {
      return;
    }

    const borderWidth = parseInt(
      window
        .getComputedStyle(this.#container.children[0])
        .getPropertyValue(`--${this.#options.cssPrefix}cell-border-width`)
    );
    const rowsHeight = this.#options.rowHeight * this.#rows.length;

    this.#body.style.height = `${rowsHeight}px`;

    const headerOuterHeight = parseInt(
      window.getComputedStyle(this.#container.children[0]).getPropertyValue(`--${this.#options.cssPrefix}header-height`)
    );
    const paginationOuterHeight =
      this.#paginationContent.clientHeight +
      2 *
        parseInt(
          window
            .getComputedStyle(this.#paginationContent)
            .getPropertyValue(`--${this.#options.cssPrefix}pagination-content-margin`)
        );

    const scrollbarHeight = this.#gridMain.offsetHeight - this.#gridMain.clientHeight;
    const gridHeight = headerOuterHeight + rowsHeight + paginationOuterHeight + scrollbarHeight;

    // check if the container is big enough to fit the grid, else set the grid height to the container height
    if (this.#containerHeight > gridHeight) {
      this.#gridMain.style.height = `${headerOuterHeight + rowsHeight + scrollbarHeight + 2 * borderWidth}px`;
    } else {
      this.#gridMain.style.height = `${this.#containerHeight - paginationOuterHeight}px`;
    }
  }

  #calculateGridWidth(): void {
    const rowMainCellsWrappers = this.#container.querySelectorAll('[ref=rowMainCellsWrapper]');

    const allColsWidth = this.#options.columns.reduce((acc, curr) => acc + (curr.width || 120), 0);
    const leftPinnedColsWidth = this.#options.columns
      .filter((col) => col.pinned === 'left')
      .reduce((acc, curr) => acc + (curr.width || 120), 0);
    const mainColsWidth = this.#options.columns
      .filter((col) => !col.pinned)
      .reduce((acc, curr) => acc + (curr.width || 120), 0);

    this.#headerMainCellsWrapper.style.left = `${leftPinnedColsWidth}px`;
    this.#headerMainCellsWrapper.style.width = `${mainColsWidth}px`;

    this.#header.style.width = `${allColsWidth}px`;
    this.#body.style.width = `${allColsWidth}px`;

    if (rowMainCellsWrappers) {
      rowMainCellsWrappers.forEach((rowMainCellsWrapper: HTMLElement) => {
        rowMainCellsWrapper.style.left = `${leftPinnedColsWidth}px`;
        rowMainCellsWrapper.style.width = `${mainColsWidth}px`;
      });
    }
  }

  #renderGrid(): HTMLElement {
    const grid = document.createElement('div');
    grid.classList.add(`${this.#options.cssPrefix}grid`);

    return grid;
  }

  #renderHeader(): HTMLElement {
    const headerContainer = document.createElement('div');
    headerContainer.classList.add(`${this.#options.cssPrefix}header`);
    headerContainer.setAttribute('role', 'rowgroup');

    const headerRow = this.#headerRow.render();
    headerContainer.appendChild(headerRow);

    return headerContainer;
  }

  #renderBody(): HTMLElement {
    const rowContainer = document.createElement('div');
    rowContainer.classList.add(`${this.#options.cssPrefix}grid-rows`);
    rowContainer.setAttribute('role', 'rowgroup');

    const rows = document.createDocumentFragment();
    this.#rows.forEach((row) => rows.appendChild(row.render()));
    rowContainer.appendChild(rows);

    return rowContainer;
  }

  #subscribeToEvents(): void {
    this.PubSub.subscribe('info:dragging:columns-reorder:done', (event: DataDenEvent) => {
      this.#columnsOrder = event.data.columnsOrder;
      this.#orderedColumns = this.#columnsOrder.map((columnIndex) => this.#defaultOrderedColumns[columnIndex]);
    });
    this.PubSub.subscribe('info:resizing:start', (event: DataDenEvent) => {
      const currentColIndex = getAllColumnsOrder(this.#options.columns)[event.data.currentColIndex];
      this.#options.columns[currentColIndex].width = event.data.newCurrentColWidth;
      this.#calculateGridWidth();
    });
    this.PubSub.subscribe('command:pin-column:start', (event: DataDenEvent) => {
      const pinningPreviousState = new DataDenPinningPreviousState({
        pin: this.#options.columns[event.data.colIndex].pinned,
      });
      this.#options.columns[event.data.colIndex].pinned = event.data.pin;

      const pinningStartEvent = DataDenEventEmitter.triggerEvent('pinningStart', {
        pin: event.data.pin,
        colIndex: event.data.colIndex,
        columns: this.#options.columns,
      });

      if (pinningStartEvent.defaultPrevented) {
        this.#options.columns[event.data.colIndex].pinned = pinningPreviousState.getValue('pin');
        return;
      }

      this.rerenderTable();

      DataDenEventEmitter.triggerEvent('pinningDone', {
        pin: event.data.pin,
        colIndex: event.data.colIndex,
        columns: this.#options.columns,
      });
    });
  }

  #subscribeFetchDone(): void {
    this.PubSub.subscribe('info:fetch:done', (event: DataDenEvent) => {
      this.#updateRows(event);
    });
  }

  #updateRows(event: DataDenEvent): void {
    const { rows } = event.data;

    const rowsEl = document.createDocumentFragment();
    this.#rows = this.#createDataRows(rows);
    this.#rows.forEach((row) => rowsEl.appendChild(row.render()));

    const rowContainer = this.#container.querySelector(`.${this.#options.cssPrefix}grid-rows`)!;
    rowContainer.innerHTML = '';
    rowContainer.appendChild(rowsEl);
    this.#calculateGridHeight();
  }
}
