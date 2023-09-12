import { DataDenOptions } from '../../data-den-options.interface';
import {
  DataDenCell,
  DataDenCellRendererParams,
  DataDenDefaultCellRenderer,
  DataDenDefaultHeaderCellRenderer,
  DataDenHeaderCell,
} from './cell';
import { DataDenCellEditorParams, DataDenDefaultCellEditor } from './editor';
import { DataDenHeaderTextFilterRenderer, DataDenQuickFilterRenderer } from './filter';
import { DataDenPaginationRenderer } from './pagination';
import { DataDenHeaderRow, DataDenRow } from './row';
import { DataDenHeaderDefaultSorterRenderer } from './sorter';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { DataDenEvent } from '../../data-den-event';

export class DataDenRenderingService {
  #container: HTMLElement;
  #orderedColumns: DataDenOptions['columns'];
  #columnsOrder: number[];
  #headerRow: DataDenHeaderRow;
  #rows: DataDenRow[] = [];
  #paddingX: number;
  #quickFilterRenderer: DataDenQuickFilterRenderer | null = null;
  #paginationRenderer: DataDenPaginationRenderer | null = null;

  constructor(container: HTMLElement, options: DataDenOptions) {
    this.#container = container;
    this.#orderedColumns = options.columns;
    this.#columnsOrder = [];
    this.#headerRow = this.#createHeaderRow(options);
    this.#rows = this.#createDataRows(options, options.rows);
    this.#paddingX = parseInt(getComputedStyle(document.body).getPropertyValue('--col-padding-x'), 10) * 2;

    if (options.quickFilter) {
      this.#quickFilterRenderer = new DataDenQuickFilterRenderer();
    }

    if (options.pagination) {
      this.#paginationRenderer = new DataDenPaginationRenderer(options.paginationOptions);
    }

    this.renderTable();
    this.#subscribeToEvents(options);
  }

  #createHeaderRow(options: DataDenOptions): DataDenHeaderRow {
    const rowIndex = 0;
    const headerCells = options.columns.map((column, colIndex) => {
      const value = column.headerName;
      const left = options.columns.slice(0, colIndex).reduce((acc, curr) => acc + (curr.width || 120), 0);

      const rendererParams: DataDenCellRendererParams = { value, left, paddingX: this.#paddingX };
      const cellRenderer = new DataDenDefaultHeaderCellRenderer(rendererParams, colIndex, options);
      const editorParams: DataDenCellEditorParams = { value: value };
      const cellEditor = new DataDenDefaultCellEditor(editorParams);
      const filterRenderer = new DataDenHeaderTextFilterRenderer();
      const sorterRenderer = new DataDenHeaderDefaultSorterRenderer();

      return new DataDenHeaderCell(rowIndex, colIndex, cellRenderer, cellEditor, filterRenderer, sorterRenderer);
    });

    return new DataDenHeaderRow(rowIndex, headerCells, options.draggable);
  }

  #createDataRows(options: DataDenOptions, dataRows: DataDenRow[]): DataDenRow[] {
    const rows = dataRows.map((row, rowIndex) => {
      const cells = Object.entries(row).map(([, value], colIndex) => {
        const orderedColIndex = this.#columnsOrder.length ? this.#columnsOrder.indexOf(colIndex) : colIndex;
        const left = this.#orderedColumns.slice(0, orderedColIndex).reduce((acc, curr) => acc + (curr.width || 120), 0);

        const rendererParams: DataDenCellRendererParams = { value, left, paddingX: this.#paddingX };
        const renderer = new DataDenDefaultCellRenderer(rendererParams);
        const editorParams: DataDenCellEditorParams = { value: value };
        const editor = new DataDenDefaultCellEditor(editorParams);
        return new DataDenCell(
          rendererParams,
          orderedColIndex,
          options.draggable,
          this.#orderedColumns,
          renderer,
          editor
        );
      });

      return new DataDenRow(rowIndex, cells);
    });

    return rows;
  }

  renderTable(): void {
    const grid = this.#renderGrid();

    if (this.#quickFilterRenderer) {
      grid.appendChild(this.#quickFilterRenderer.getGui());
    }

    grid.appendChild(this.#renderHeader());
    grid.appendChild(this.#renderBody());

    if (this.#paginationRenderer) {
      grid.appendChild(this.#paginationRenderer.getGui());
    }

    this.#container.appendChild(grid);
  }

  #updateRows(options: DataDenOptions, dataRows: DataDenRow[]): void {
    const rows = document.createDocumentFragment();
    this.#rows = this.#createDataRows(options, dataRows);
    this.#rows.forEach((row) => rows.appendChild(row.render()));

    const rowContainer = this.#container.querySelector('.data-den-grid-rows') as HTMLElement;
    rowContainer.innerHTML = '';
    rowContainer.appendChild(rows);
  }

  #subscribeToEvents(options: DataDenOptions): void {
    DataDenPubSub.subscribe('info:pagination:data-change:done', (event: DataDenEvent) => {
      this.#updateRows(options, event.data.rows);
    });
    DataDenPubSub.subscribe('info:dragging:columns-reorder:done', (event: DataDenEvent) => {
      this.#columnsOrder = event.data.columnsOrder;
      const defaultColumns = [...options.columns];
      this.#orderedColumns = [];

      this.#columnsOrder.forEach((columnIndex, index) => {
        this.#orderedColumns[index] = defaultColumns[columnIndex];
      });
    });
  }

  #renderGrid(): HTMLElement {
    const grid = document.createElement('div');
    grid.classList.add('data-den-grid');

    return grid;
  }

  #renderHeader(): HTMLElement {
    const headerContainer = document.createElement('div');
    headerContainer.classList.add('data-den-header');
    headerContainer.setAttribute('role', 'rowgroup');

    const headerRow = this.#headerRow.render();
    headerContainer.appendChild(headerRow);

    return headerContainer;
  }

  #renderBody(): HTMLElement {
    const rowContainer = document.createElement('div');
    rowContainer.classList.add('data-den-grid-rows');
    rowContainer.setAttribute('role', 'rowgroup');

    const rows = document.createDocumentFragment();
    this.#rows.forEach((row) => rows.appendChild(row.render()));
    rowContainer.appendChild(rows);

    return rowContainer;
  }
}
