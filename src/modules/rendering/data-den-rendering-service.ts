import { DataDenOptions } from '../../data-den-options.interface';
import {
  DataDenCell,
  DataDenCellRendererParams,
  DataDenDefaultCellRenderer,
  DataDenDefaultHeaderCellRenderer,
  DataDenHeaderCell,
} from './cell';
import { DataDenCellEditorParams, DataDenDefaultCellEditor } from './editor';
import { DataDenHeaderTextFilterRenderer, DataDenQuickFilterParams, DataDenQuickFilterRenderer } from './filter';
import { DataDenHeaderFilterRendererParams } from './filter/data-den-header-filter-renderer-params.interface';
import { DataDenPaginationRenderer } from './pagination';
import { DataDenHeaderRow, DataDenRow } from './row';
import { DataDenHeaderDefaultSorterRenderer } from './sorter';
import { DataDenHeaderDefaultResizerRenderer } from './resizer';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { DataDenEvent } from '../../data-den-event';
import { Order } from '../sorting/data-den-sorting.interface';

export class DataDenRenderingService {
  #container: HTMLElement;
  #orderedColumns: DataDenOptions['columns'];
  #columnsOrder: number[];
  #headerRow: DataDenHeaderRow;
  #rows: DataDenRow[] = [];
  #paddingX: number;
  #borderWidth: number;
  #rowHeight: number;
  #quickFilterRenderer: DataDenQuickFilterRenderer | null = null;
  #paginationRenderer: DataDenPaginationRenderer | null = null;

  constructor(container: HTMLElement, options: DataDenOptions) {
    this.#container = container;
    this.#orderedColumns = options.columns;
    this.#columnsOrder = [];
    this.#paddingX = parseInt(getComputedStyle(document.body).getPropertyValue('--col-padding-x'), 10) * 2;
    this.#borderWidth = parseInt(getComputedStyle(document.body).getPropertyValue('--border-width'), 10) * 2;
    this.#rowHeight = parseInt(getComputedStyle(document.body).getPropertyValue('--row-height'), 10);
    this.#headerRow = this.#createHeaderRow(options, '');
    this.#rows = this.#createDataRows(options, options.rows);

    if (options.quickFilter) {
      const { debounceTime } = options.quickFilterOptions;
      const params: DataDenQuickFilterParams = { debounceTime };
      this.#quickFilterRenderer = new DataDenQuickFilterRenderer(params);
    }

    if (options.pagination) {
      this.#paginationRenderer = new DataDenPaginationRenderer(options.paginationOptions);
    }

    this.renderTable();
    this.#subscribeToEvents(options);
    this.#subscribeSortingDone(options);
  }

  #createHeaderRow(options: DataDenOptions, order: Order): DataDenHeaderRow {
    const rowIndex = 0;
    const headerCells = options.columns.map((column, colIndex) => {
      const value = column.headerName;
      const left = options.columns.slice(0, colIndex).reduce((acc, curr) => acc + (curr.width || 120), 0);

      const rendererParams: DataDenCellRendererParams = {
        value,
        left,
        paddingX: this.#paddingX,
        borderWidth: this.#borderWidth,
      };
      const cellRenderer = new DataDenDefaultHeaderCellRenderer(rendererParams, colIndex, options);
      const field = column.field;
      const { method, debounceTime, caseSensitive } = column.filterOptions;
      const editorParams: DataDenCellEditorParams = { value: value };
      const cellEditor = new DataDenDefaultCellEditor(editorParams);
      const filterRendererParams: DataDenHeaderFilterRendererParams = { field, method, debounceTime, caseSensitive };
      const filterRenderer = new DataDenHeaderTextFilterRenderer(filterRendererParams);
      const sorterRenderer = new DataDenHeaderDefaultSorterRenderer(column.field, order, options.rows);
      const resizerRenderer = new DataDenHeaderDefaultResizerRenderer();

      return new DataDenHeaderCell(
        rowIndex,
        colIndex,
        cellRenderer,
        cellEditor,
        filterRenderer,
        sorterRenderer,
        resizerRenderer
      );
    });

    return new DataDenHeaderRow(rowIndex, headerCells, options.draggable);
  }

  #createDataRows(options: DataDenOptions, dataRows: DataDenRow[]): DataDenRow[] {
    return dataRows.map((row, rowIndex) => {
      const cells = Object.entries(row).map(([, value], colIndex) => {
        const orderedColIndex = this.#columnsOrder.length ? this.#columnsOrder.indexOf(colIndex) : colIndex;
        const left = this.#orderedColumns.slice(0, orderedColIndex).reduce((acc, curr) => acc + (curr.width || 120), 0);

        const rendererParams: DataDenCellRendererParams = {
          value,
          left,
          paddingX: this.#paddingX,
          borderWidth: this.#borderWidth,
        };
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

      return new DataDenRow(rowIndex, cells, this.#rowHeight);
    });
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
    this.#calculateGridSize();
  }

  #calculateGridSize(): void {
    const grid = this.#container.querySelector('.data-den-grid') as HTMLElement;
    const header = this.#container.querySelector('.data-den-header') as HTMLElement;
    const body = this.#container.querySelector('.data-den-grid-rows') as HTMLElement;

    const gridWidth = this.#orderedColumns.reduce((acc, curr) => acc + (curr.width || 120), 0);
    const rowsHeight = this.#rowHeight * this.#rows.length;

    grid.style.width = `${gridWidth}px`;
    header.style.width = `${gridWidth}px`;
    body.style.width = `${gridWidth}px`;
    body.style.height = `${rowsHeight}px`;
  }

  #updateRows(options: DataDenOptions, dataRows: DataDenRow[]): void {
    const rows = document.createDocumentFragment();
    this.#rows = this.#createDataRows(options, dataRows);
    this.#rows.forEach((row) => rows.appendChild(row.render()));

    const rowContainer = this.#container.querySelector('.data-den-grid-rows') as HTMLElement;
    rowContainer.innerHTML = '';
    rowContainer.appendChild(rows);
    this.#calculateGridSize();
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
    DataDenPubSub.subscribe('info:resizing:start', (event: DataDenEvent) => {
      this.#orderedColumns[event.data.currentColIndex].width =
        event.data.newCurrentColWidth + this.#paddingX + this.#borderWidth;
      this.#calculateGridSize();
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

  #subscribeSortingDone(options: DataDenOptions): void {
    DataDenPubSub.subscribe('info:sorting:done', (event: DataDenEvent) => {
      this.#headerRow = this.#createHeaderRow(options, event.data.order);
      this.#rows = this.#createDataRows(options, event.data.rows);

      this.#container.innerHTML = '';
      this.renderTable();
    });
  }
}
