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
    this.#orderedColumns = getMainOrderedColumns(this.#options.columns);
    this.#defaultOrderedColumns = getMainOrderedColumns(this.#options.columns);
    this.#columnsOrder = getMainColumnIndexes(this.#options.columns);
    this.#headerRow = this.#createHeaderRow(options.columns, '');

    if (options.quickFilter) {
      const { debounceTime } = options.quickFilterOptions;
      const params: DataDenQuickFilterParams = { debounceTime, cssPrefix: this.#options.cssPrefix };
      this.#quickFilterRenderer = new DataDenQuickFilterRenderer(params);
    }

    if (options.pagination) {
      this.#paginationRenderer = new DataDenPaginationRenderer(options.paginationOptions);
    }

    this.renderTable();
    this.#subscribeToEvents();
    this.#subscribeFetchDone();
    this.#publishFetchStart();
  }

  #createHeaderRow(colDefs: DataDenColDef[], order: Order): DataDenHeaderRow {
    const rowIndex = 0;

    const pinnedColumnsLeft = getPinnedLeftColumns(colDefs);
    const nonPinnedColumns = getMainColumns(colDefs);
    const pinnedColumnsRight = getPinnedRightColumns(colDefs);

    const pinnedHeaderCellsLeft = pinnedColumnsLeft.map((col, index) => {
      const value = col.headerName;
      const left = 0;
      const width = pinnedColumnsLeft[index].width || 120;
      const colIndex = this.#options.columns.map((defaultColumn) => defaultColumn.field).indexOf(col.field);

      return new DataDenHeaderCell(value, colIndex, rowIndex, left, width, col.pinned, this.#options, order);
    });

    const headerCells = nonPinnedColumns.map((col, index) => {
      const value = col.headerName;
      const left = this.#orderedColumns.slice(0, index).reduce((acc, curr) => acc + (curr.width || 120), 0);
      const width = this.#orderedColumns[index].width || 120;
      const colIndex = this.#options.columns.map((defaultColumn) => defaultColumn.field).indexOf(col.field);

      return new DataDenHeaderCell(value, colIndex, rowIndex, left, width, col.pinned, this.#options, order);
    });

    const pinnedHeaderCellsRight = pinnedColumnsRight.reverse().map((col, index) => {
      const value = col.headerName;
      const left = 0;
      const width = pinnedColumnsRight[index].width || 120;
      const colIndex = this.#options.columns.map((defaultColumn) => defaultColumn.field).indexOf(col.field);

      return new DataDenHeaderCell(value, colIndex, rowIndex, left, width, col.pinned, this.#options, order);
    });

    return new DataDenHeaderRow(rowIndex, pinnedHeaderCellsLeft, headerCells, pinnedHeaderCellsRight, this.#options);
  }

  #createDataRows(rowsData: any): DataDenRow[] {
    return rowsData.map((rowData: any, rowIndex: number) => {
      const pinnedCellsLeft = Object.entries(rowData).map(([key, value], colIndex) => {
        const colDef = this.#options.columns.find((col) => col.field === key)!;
        if (colDef.pinned !== 'left') {
          return;
        }

        const left = 0;
        const width = this.#options.columns[colIndex].width || 120;

        return new DataDenCell(value, colIndex, rowIndex, left, width, colDef.pinned, this.#options);
      });

      const cells = Object.entries(rowData).map(([key, value], colIndex) => {
        const colDef = this.#options.columns.find((col) => col.field === key)!;
        if (colDef.pinned) {
          return;
        }

        const orderedColIndex = this.#orderedColumns.findIndex((col) => col.field === key);
        const left = this.#orderedColumns.slice(0, orderedColIndex).reduce((acc, curr) => acc + (curr.width || 120), 0);
        const width = this.#orderedColumns[orderedColIndex].width || 120;

        return new DataDenCell(value, colIndex, rowIndex, left, width, colDef.pinned, this.#options);
      });

      const pinnedCellsRight = Object.entries(rowData)
        .reverse()
        .map(([key, value], colIndex) => {
          const colDef = this.#options.columns.find((col) => col.field === key)!;
          if (colDef.pinned !== 'right') {
            return;
          }

          const pinnedColIndex = this.#options.columns
            .filter((col) => col.pinned === 'right')
            .map((defaultColumn) => defaultColumn.field)
            .indexOf(key);

          const left = 0;
          const width = getPinnedRightColumns(this.#options.columns)[pinnedColIndex].width || 120;

          return new DataDenCell(value, colIndex, rowIndex, left, width, colDef.pinned, this.#options);
        });

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
