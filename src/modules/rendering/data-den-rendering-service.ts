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
import { Order } from '../sorting/data-den-sorting.interface';
import { DataDenData } from '../fetch';
import { Context } from '../../context';

export class DataDenRenderingService {
  #container: HTMLElement;
  #data: DataDenData;
  #headerRow: DataDenHeaderRow;
  #rows: DataDenRow[] = [];
  #quickFilterRenderer: DataDenQuickFilterRenderer | null = null;
  #paginationRenderer: DataDenPaginationRenderer | null = null;

  constructor(container: HTMLElement, options: DataDenOptions) {
    this.#data = {
      columns: [],
      rows: [],
    };
    this.#headerRow = this.#createHeaderRow(this.#data, '');
    this.#rows = this.#createDataRows(this.#data);
    this.#container = container;

    if (options.quickFilter) {
      this.#quickFilterRenderer = new DataDenQuickFilterRenderer();
    }

    if (options.pagination) {
      this.#paginationRenderer = new DataDenPaginationRenderer();
    }

    this.#subscribeFetchDone();
    this.#publishFetchStart();
  }

  #createHeaderRow(data: DataDenData, order: Order): DataDenHeaderRow {
    const rowIndex = 0;
    const headerCells = data.columns.map((column, colIndex) => {
      const value = column.headerName;
      const rendererParams: DataDenCellRendererParams = { value: value };
      const cellRenderer = new DataDenDefaultHeaderCellRenderer(rendererParams);
      const editorParams: DataDenCellEditorParams = { value: value };
      const cellEditor = new DataDenDefaultCellEditor(editorParams);
      const filterRenderer = new DataDenHeaderTextFilterRenderer();
      const sorterRenderer = new DataDenHeaderDefaultSorterRenderer(column.field, order);

      return new DataDenHeaderCell(rowIndex, colIndex, cellRenderer, cellEditor, filterRenderer, sorterRenderer);
    });

    return new DataDenHeaderRow(rowIndex, headerCells);
  }

  #createDataRows(data: DataDenData): DataDenRow[] {
    return data.rows.map((row, rowIndex) => {
      const cells = Object.entries(row).map(([, value], columnIndex) => {
        const rendererParams: DataDenCellRendererParams = { value: value };
        const renderer = new DataDenDefaultCellRenderer(rendererParams);
        const editorParams: DataDenCellEditorParams = { value: value };
        const editor = new DataDenDefaultCellEditor(editorParams);
        return new DataDenCell(rowIndex, columnIndex, renderer, editor);
      });

      return new DataDenRow(rowIndex, cells);
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

  #subscribeFetchDone(): void {
    DataDenPubSub.subscribe('info:fetch:done', (event: DataDenEvent) => {
      switch (event.context.action) {
        case 'command:fetch:start':
          this.#updateTable(event);
          break;
        case 'command:fetch:getSortedData':
          this.#updateRows(event);
          break;
        default:
          break;
      }
    });
  }

  #updateTable(event: DataDenEvent) {
    this.#data = { ...event.data.data, ...this.#data.columns };
    this.#headerRow = this.#createHeaderRow(this.#data, event.data.order);
    this.#rows = this.#createDataRows(this.#data);

    this.#container.innerHTML = '';
    this.renderTable();
  }

  #updateRows(event: DataDenEvent) {
    this.#data.rows = event.data.data.rows;
    this.#rows = this.#createDataRows(this.#data);

    const headerEl = this.#container.querySelector('.data-den-grid-rows');
    this.#rows = this.#createDataRows(this.#data);

    headerEl?.replaceWith(this.#renderBody());
  }
}
