import { DataDenColDef, DataDenOptions } from '../../data-den-options.interface';
import {
  DataDenCell,
  DataDenCellRendererParams,
  DataDenDefaultCellRenderer,
  DataDenDefaultHeaderCellRenderer,
  DataDenHeaderCell,
} from './cell';
import { DataDenCellEditorParams, DataDenDefaultCellEditor } from './editor';
import {
  DataDenHeaderDateFilterRenderer,
  DataDenHeaderNumberFilterRenderer,
  DataDenHeaderTextFilterRenderer,
  DataDenQuickFilterParams,
  DataDenQuickFilterRenderer,
} from './filter';
import { DataDenHeaderFilterRendererParams } from './filter/data-den-header-filter-renderer-params.interface';
import { DataDenPaginationRenderer } from './pagination';
import { DataDenHeaderRow, DataDenRow } from './row';
import { DataDenHeaderDefaultSorterRenderer } from './sorter';
import { DataDenHeaderDefaultResizerRenderer } from './resizer';
import { DataDenPubSub } from '../../data-den-pub-sub';
import { DataDenEvent } from '../../data-den-event';
import { Order } from '../sorting/data-den-sorting.interface';
import { Context } from '../../context';

export class DataDenRenderingService {
  #container: HTMLElement;
  #options: DataDenOptions;
  #defaultColumns: DataDenColDef[];
  #orderedColumns: DataDenColDef[];
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
    this.#options = options;
    this.#headerRow = this.#createHeaderRow([], '');
    this.#rows = this.#createDataRows([]);
    this.#defaultColumns = [];
    this.#orderedColumns = [];
    this.#columnsOrder = [];
    this.#paddingX = parseInt(getComputedStyle(document.body).getPropertyValue('--col-padding-x'), 10) * 2;
    this.#borderWidth = parseInt(getComputedStyle(document.body).getPropertyValue('--border-width'), 10) * 2;
    this.#rowHeight = parseInt(getComputedStyle(document.body).getPropertyValue('--row-height'), 10);

    if (options.quickFilter) {
      const { debounceTime } = options.quickFilterOptions;
      const params: DataDenQuickFilterParams = { debounceTime };
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

  #createHeaderRow(columns: DataDenColDef[], order: Order): DataDenHeaderRow {
    const rowIndex = 0;
    const headerCells = columns.map((column, colIndex) => {
      const value = column.headerName;
      const left = columns.slice(0, colIndex).reduce((acc, curr) => acc + (curr.width || 120), 0);
      const width = (columns[colIndex].width || 120) - this.#paddingX - this.#borderWidth;

      const rendererParams: DataDenCellRendererParams = {
        value,
        left,
        width,
      };
      const cellRenderer = new DataDenDefaultHeaderCellRenderer(rendererParams, this.#options.draggable);
      const editorParams: DataDenCellEditorParams = { value: value };
      const cellEditor = new DataDenDefaultCellEditor(editorParams);
      const sorterRenderer = new DataDenHeaderDefaultSorterRenderer(column.field, order);
      const filterRenderer = this.#getHeaderFilterRenderer(column);
      const resizerRenderer = new DataDenHeaderDefaultResizerRenderer();

      return new DataDenHeaderCell(
        rowIndex,
        colIndex,
        cellRenderer,
        cellEditor,
        filterRenderer,
        sorterRenderer,
        resizerRenderer,
        column
      );
    });

    return new DataDenHeaderRow(rowIndex, headerCells, this.#options.draggable);
  }

  #getHeaderFilterRenderer(column: DataDenColDef) {
    const field = column.field;
    const { type, method, debounceTime } = column.filterOptions;
    const params: DataDenHeaderFilterRendererParams = {
      field,
      method,
      debounceTime,
    };

    switch (type) {
      case 'text':
        return new DataDenHeaderTextFilterRenderer(params);
      case 'number':
        return new DataDenHeaderNumberFilterRenderer(params);
      case 'date':
        return new DataDenHeaderDateFilterRenderer(params);
      default:
        return new DataDenHeaderTextFilterRenderer(params);
    }
  }

  #createDataRows(dataRows: DataDenRow[]): DataDenRow[] {
    return dataRows.map((row, rowIndex) => {
      const cells = Object.entries(row).map(([, value], colIndex) => {
        const orderedColIndex = this.#columnsOrder.length ? this.#columnsOrder.indexOf(colIndex) : colIndex;
        const left = this.#orderedColumns.slice(0, orderedColIndex).reduce((acc, curr) => acc + (curr.width || 120), 0);
        const width = (this.#orderedColumns[orderedColIndex].width || 120) - this.#paddingX - this.#borderWidth;

        const rendererParams: DataDenCellRendererParams = {
          value,
          left,
          width,
        };
        const renderer = new DataDenDefaultCellRenderer(rendererParams);
        const editorParams: DataDenCellEditorParams = { value: value };
        const editor = new DataDenDefaultCellEditor(editorParams);
        return new DataDenCell(rendererParams, this.#options.draggable, renderer, editor);
      });

      return new DataDenRow(rowIndex, cells, this.#rowHeight);
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

  #subscribeToEvents(): void {
    DataDenPubSub.subscribe('info:dragging:columns-reorder:done', (event: DataDenEvent) => {
      this.#columnsOrder = event.data.columnsOrder;
      this.#orderedColumns = this.#columnsOrder.map((columnIndex) => this.#defaultColumns[columnIndex]);
    });
    DataDenPubSub.subscribe('info:resizing:start', (event: DataDenEvent) => {
      this.#orderedColumns[event.data.currentColIndex].width =
        event.data.newCurrentColWidth + this.#paddingX + this.#borderWidth;
      this.#calculateGridSize();
    });
  }

  #subscribeFetchDone(): void {
    DataDenPubSub.subscribe('info:fetch:done', (event: DataDenEvent) => {
      switch (event.context.action) {
        case 'command:fetch:start':
          this.#updateTable(event);
          break;
        default:
          this.#updateRows(event);
          break;
      }
    });
  }

  #updateTable(event: DataDenEvent) {
    const { columns, rows, order } = event.data;

    this.#defaultColumns = [...columns];
    this.#orderedColumns = [...columns];
    this.#headerRow = this.#createHeaderRow(columns, order);
    this.#rows = this.#createDataRows(rows);

    this.#container.innerHTML = '';
    this.renderTable();
  }

  #updateRows(event: DataDenEvent): void {
    const { rows } = event.data;

    const rowsEl = document.createDocumentFragment();
    this.#rows = this.#createDataRows(rows);
    this.#rows.forEach((row) => rowsEl.appendChild(row.render()));

    const rowContainer = this.#container.querySelector('.data-den-grid-rows')!;
    rowContainer.innerHTML = '';
    rowContainer.appendChild(rowsEl);
    this.#calculateGridSize();
  }
}
