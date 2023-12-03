import { DataDenColDef, DataDenInternalOptions } from '../../data-den-options.interface';
import { DataDenCell, DataDenHeaderCell } from './cell';
import { DataDenQuickFilterParams, DataDenQuickFilterRenderer } from './filter';
import { DataDenPaginationRenderer } from './pagination';
import { DataDenHeaderRow, DataDenRow } from './row';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { DataDenEvent } from '../../data-den-event';
import { Order } from '../sorting/data-den-sorting.interface';
import { Context } from '../../context';
import {
  getMainColumnIndexes,
  getMainOrderedColumns,
  getPinnedLeftColumns,
  getMainColumns,
  getPinnedRightColumns,
  getAllColumnsOrder,
} from '../../utils/columns-order';

export class DataDenRenderingService {
  #container: HTMLElement;
  #options: DataDenInternalOptions;
  #orderedColumns: DataDenColDef[];
  #defaultOrderedColumns: DataDenColDef[];
  #columnsOrder: number[];
  #headerRow: DataDenHeaderRow;
  #rows: DataDenRow[] = [];
  #quickFilterRenderer: DataDenQuickFilterRenderer | null = null;
  #paginationRenderer: DataDenPaginationRenderer | null = null;

  constructor(container: HTMLElement, options: DataDenInternalOptions) {
    this.#container = container;
    this.#options = options;

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

    if (this.#options.quickFilter) {
      const { debounceTime } = this.#options.quickFilterOptions;
      const params: DataDenQuickFilterParams = { debounceTime, cssPrefix: this.#options.cssPrefix };
      this.#quickFilterRenderer = new DataDenQuickFilterRenderer(params);
    }

    if (this.#options.pagination) {
      this.#paginationRenderer = new DataDenPaginationRenderer(this.#options.paginationOptions);
    }

    this.renderTable();
  }

  #createPinnedHeaderCells(pinnedColumns: DataDenColDef[], rowIndex: number, order: Order): DataDenHeaderCell[] {
    return pinnedColumns.map((col) => {
      const value = col.headerName;
      const left = 0;
      const width = col.width || 120;
      const colIndex = this.#options.columns.map((defaultColumn) => defaultColumn.field).indexOf(col.field);

      return new DataDenHeaderCell(value, colIndex, rowIndex, left, width, col.pinned, this.#options, order);
    });
  }

  #createMainHeaderCells(mainColumns: DataDenColDef[], rowIndex: number, order: Order): DataDenHeaderCell[] {
    return mainColumns.map((col, index) => {
      const value = col.headerName;
      const left = this.#orderedColumns.slice(0, index).reduce((acc, curr) => acc + (curr.width || 120), 0);
      const width = this.#orderedColumns[index].width || 120;
      const colIndex = this.#options.columns.map((defaultColumn) => defaultColumn.field).indexOf(col.field);

      return new DataDenHeaderCell(value, colIndex, rowIndex, left, width, col.pinned, this.#options, order);
    });
  }

  #createHeaderRow(colDefs: DataDenColDef[], order: Order): DataDenHeaderRow {
    const rowIndex = 0;

    const pinnedHeaderCellsLeft = this.#createPinnedHeaderCells(getPinnedLeftColumns(colDefs), rowIndex, order);
    const mainHeaderCells = this.#createMainHeaderCells(getMainColumns(colDefs), rowIndex, order);
    const pinnedHeaderCellsRight = this.#createPinnedHeaderCells(
      getPinnedRightColumns(colDefs).reverse(),
      rowIndex,
      order
    );

    return new DataDenHeaderRow(
      rowIndex,
      pinnedHeaderCellsLeft,
      mainHeaderCells,
      pinnedHeaderCellsRight,
      this.#options
    );
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
      const cells = Object.entries(rowData).map(([key, value], colIndex) =>
        this.#createMainCells(key, value, colIndex, rowIndex)
      );
      const pinnedCellsRight = Object.entries(rowData)
        .reverse()
        .map(([key, value], colIndex) => this.#createPinnedCellsRight(key, value, colIndex, rowIndex));

      return new DataDenRow(rowIndex, pinnedCellsLeft, cells, pinnedCellsRight, this.#options);
    });
  }

  #publishFetchStart() {
    DataDenPubSub.publish('command:fetch:start', {
      caller: this,
      context: new Context('command:fetch:start'),
    });
  }

  renderTable(): void {
    const grid = this.#renderGrid();

    if (this.#quickFilterRenderer) {
      grid.appendChild(this.#quickFilterRenderer.getGui());
    }

    const gridMain = document.createElement('div');
    gridMain.setAttribute('ref', 'gridMain');
    gridMain.classList.add(`${this.#options.cssPrefix}grid-main`);

    gridMain.appendChild(this.#renderHeader());
    gridMain.appendChild(this.#renderBody());
    grid.appendChild(gridMain);

    if (this.#paginationRenderer) {
      grid.appendChild(this.#paginationRenderer.getGui());
    }

    this.#container.appendChild(grid);
    this.#calculateGridSize();
  }

  rerenderTable(): void {
    this.#container.innerHTML = '';

    this.#init();
    this.#subscribeFetchDone();
    this.#publishFetchStart();

    DataDenPubSub.publish('command:rerendering:done', {
      caller: this,
      context: new Context('command:rendering:done'),
    });
  }

  #calculateGridSize(): void {
    const header = this.#container.querySelector(`.${this.#options.cssPrefix}header`) as HTMLElement;
    const body = this.#container.querySelector(`.${this.#options.cssPrefix}grid-rows`) as HTMLElement;
    const headerMainCellsWrapper = this.#container.querySelector('[ref=headerMainCellsWrapper]') as HTMLElement;
    const rowMainCellsWrappers = this.#container.querySelectorAll('[ref=rowMainCellsWrapper]');

    const allColsWidth = this.#options.columns.reduce((acc, curr) => acc + (curr.width || 120), 0);
    const leftPinnedColsWidth = this.#options.columns
      .filter((col) => col.pinned === 'left')
      .reduce((acc, curr) => acc + (curr.width || 120), 0);
    const mainColsWidth = this.#options.columns
      .filter((col) => !col.pinned)
      .reduce((acc, curr) => acc + (curr.width || 120), 0);
    const rowsHeight = this.#options.rowHeight * this.#rows.length + 2;

    header.style.width = `${allColsWidth}px`;
    body.style.width = `${allColsWidth}px`;
    body.style.height = `${rowsHeight}px`;
    headerMainCellsWrapper.style.left = `${leftPinnedColsWidth}px`;
    headerMainCellsWrapper.style.width = `${mainColsWidth}px`;

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
    DataDenPubSub.subscribe('info:dragging:columns-reorder:done', (event: DataDenEvent) => {
      this.#columnsOrder = event.data.columnsOrder;
      this.#orderedColumns = this.#columnsOrder.map((columnIndex) => this.#defaultOrderedColumns[columnIndex]);
    });
    DataDenPubSub.subscribe('info:resizing:start', (event: DataDenEvent) => {
      const currentColIndex = getAllColumnsOrder(this.#options.columns)[event.data.currentColIndex];
      this.#options.columns[currentColIndex].width = event.data.newCurrentColWidth;
      this.#calculateGridSize();
    });
    DataDenPubSub.subscribe('command:pin-column:start', (event: DataDenEvent) => {
      this.#options.columns[event.data.colIndex].pinned = event.data.pin;
      this.rerenderTable();
    });
  }

  #subscribeFetchDone(): void {
    DataDenPubSub.subscribe('info:fetch:done', (event: DataDenEvent) => {
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
    this.#calculateGridSize();
  }
}
