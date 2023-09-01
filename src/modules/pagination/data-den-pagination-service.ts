import { DataDenPubSub } from '../../data-den-pub-sub';
import { DataDenPaginationOptions } from '../../data-den-options.interface';

export class DataDenPaginationService {
  private data: any[];
  private options: DataDenPaginationOptions;
  private currentPage: number;
  private pageSize: number;

  constructor(options: DataDenPaginationOptions) {
    this.data = [];
    this.options = options;

    this.currentPage = 0;
    this.pageSize = this.options.pageSize || 10;

    this.subscribeToEvents();
  }

  init(data: any[]) {
    this.data = data;
    this.updateState();
  }

  private subscribeToEvents() {
    DataDenPubSub.subscribe('command:pagination:load-first-page', () => {
      this.loadFirstPage();
    });
    DataDenPubSub.subscribe('command:pagination:load-prev-page', () => {
      this.loadPrevPage();
    });
    DataDenPubSub.subscribe('command:pagination:load-next-page', () => {
      this.loadNextPage();
    });
    DataDenPubSub.subscribe('command:pagination:load-last-page', () => {
      this.loadLastPage();
    });
    DataDenPubSub.subscribe('command:pagination:page-size-changed', (event: { data: { pageSize: number } }) => {
      this.pageSize = event.data.pageSize;
      this.currentPage = 0;
      this.updateState();
    });
  }

  private updateState(): void {
    const firstRow = this.currentPage * this.pageSize + 1;
    const lastRow = Math.min(this.data.length, this.currentPage * this.pageSize + this.pageSize);
    const allTotalRows = this.data.length;

    this.publishEvents(firstRow, lastRow, allTotalRows);
  }

  private publishEvents(firstRow: number, lastRow: number, allTotalRows: number) {
    DataDenPubSub.publish('command:pagination:info-changed', {
      firstRow,
      lastRow,
      allTotalRows,
      pageSize: this.pageSize,
      context: {
        action: 'info-changed',
      },
    });
    DataDenPubSub.publish('command:pagination:data-changed', {
      rows: this.data.slice(firstRow - 1, lastRow),
      context: {
        action: 'data-changed',
      },
    });
  }

  private loadFirstPage() {
    this.currentPage = 0;
    this.updateState();
  }

  private loadPrevPage() {
    if (this.currentPage === 0) {
      return;
    }

    this.currentPage--;
    this.updateState();
  }

  private loadNextPage() {
    if (this.currentPage * this.pageSize + this.pageSize >= this.data.length) {
      return;
    }

    this.currentPage++;
    this.updateState();
  }

  private loadLastPage() {
    if (this.data.length / this.pageSize - 1 >= this.data.length) {
      return;
    }

    this.currentPage = Math.ceil(this.data.length / this.pageSize - 1);
    this.updateState();
  }
}
