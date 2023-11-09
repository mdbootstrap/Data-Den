import { DataDenColDef, DataDenInternalOptions } from '../../data-den-options.interface';
import { DataDenCell, DataDenHeaderCell } from './cell';
import { DataDenQuickFilterParams, DataDenQuickFilterRenderer } from './filter';
import { DataDenPaginationRenderer } from './pagination';
import { DataDenHeaderRow, DataDenRow } from './row';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { DataDenEvent } from '../../data-den-event';
import { Order } from '../sorting/data-den-sorting.interface';
import { Context } from '../../context';
import { getColumnsOrder, getOrderedColumns } from '../../utils/columns-order';

export class DataDenRenderingService {
  #container: HTMLElement;
  #options: DataDenInternalOptions;
  #orderedColumns: DataDenColDef[];
  #columnsOrder: number[];
  #headerRow: DataDenHeaderRow;
  #rows: DataDenRow[] = [];
  #quickFilterRenderer: DataDenQuickFilterRenderer | null = null;
  #paginationRenderer: DataDenPaginationRenderer | null = null;

  constructor(container: HTMLElement, options: DataDenInternalOptions) {
    this.#container = container;
    this.#options = options;
    this.#orderedColumns = getOrderedColumns(this.#options.columns);
    this.#columnsOrder = getColumnsOrder(this.#options.columns);
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
    const headerCells = colDefs.map((colDef, colIndex) => {
      const value = colDef.headerName;
      const orderedColIndex = this.#columnsOrder.indexOf(colIndex);
      const left = this.#orderedColumns.slice(0, orderedColIndex).reduce((acc, curr) => acc + (curr.width || 120), 0);
      const width = this.#orderedColumns[orderedColIndex].width || 120;

      const right =
        this.#orderedColumns
          .slice(orderedColIndex + 1, colDefs.length)
          .filter((col) => col.fixed === 'right')
          .reduce((acc, curr) => acc + (curr.width || 120), 0) + 4;

      return new DataDenHeaderCell(value, colIndex, rowIndex, left, right, width, colDef.fixed, this.#options, order);
    });

    return new DataDenHeaderRow(rowIndex, headerCells, this.#options);
  }

  #createDataRows(rowsData: any): DataDenRow[] {
    return rowsData.map((rowData: any, rowIndex: number) => {
      const cells = Object.entries(rowData).map(([, value], colIndex) => {
        const orderedColIndex = this.#columnsOrder.indexOf(colIndex);
        const left = this.#orderedColumns.slice(0, orderedColIndex).reduce((acc, curr) => acc + (curr.width || 120), 0);
        const width = this.#orderedColumns[orderedColIndex].width || 120;
        const right =
          this.#orderedColumns
            .slice(orderedColIndex + 1, this.#columnsOrder.length)
            .filter((col) => col.fixed === 'right')
            .reduce((acc, curr) => acc + (curr.width || 120), 0) + 4;

        return new DataDenCell(value, colIndex, rowIndex, left, right, width, this.#options);
      });

      return new DataDenRow(rowIndex, cells, this.#options);
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

    const gridWidth = this.#orderedColumns.reduce((acc, curr) => acc + (curr.width || 120), 0);
    const rowsHeight = this.#options.rowHeight * this.#rows.length + 2;

    header.style.width = `${gridWidth}px`;
    body.style.width = `${gridWidth}px`;
    body.style.height = `${rowsHeight}px`;
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
      this.#orderedColumns = this.#columnsOrder.map((columnIndex) => this.#options.columns[columnIndex]);
    });
    DataDenPubSub.subscribe('info:resizing:start', (event: DataDenEvent) => {
      this.#options.columns[event.data.currentColIndex].width = event.data.newCurrentColWidth;
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
