import { createHtmlElement } from '../../../utils';
import { DataDenPubSub } from '../../../data-den-pub-sub';
import { DataDenPaginationOptions } from '../../../data-den-options.interface';
import { Context } from '../../../context';

export class DataDenPaginationRenderer {
  element: HTMLElement;
  options: DataDenPaginationOptions;

  constructor(options: DataDenPaginationOptions) {
    this.options = options;

    const template =
      /* HTML */
      `<div class="data-den-pagination">
        <div class="data-den-pagination-content">
          <button class="data-den-pagination-first-button"><<</button>
          <button class="data-den-pagination-prev-button"><</button>
          <div class="data-den-pagination-info">1-10 ${this.options.ofText || 'of'} 100</div>
          <button class="data-den-pagination-next-button">></button>
          <button class="data-den-pagination-last-button">>></button>
        </div>
        <select class="data-den-pagination-page-size">
          ${this.options.pageSizeOptions?.map((pageSize) => `<option value="${pageSize}">${pageSize}</option>`) ||
          '<option value="10">10</option><option value="20">20</option><option value="50">50</option>'}
        </select>
      </div>`;

    this.element = createHtmlElement(template);
    this.attachUiEvents();
    this.subscribeToEvents();
  }

  getGui(): HTMLElement {
    return this.element;
  }

  attachUiEvents(): void {
    const firstButton = this.element.querySelector('.data-den-pagination-first-button') as HTMLButtonElement;
    const prevButton = this.element.querySelector('.data-den-pagination-prev-button') as HTMLButtonElement;
    const nextButton = this.element.querySelector('.data-den-pagination-next-button') as HTMLButtonElement;
    const lastButton = this.element.querySelector('.data-den-pagination-last-button') as HTMLButtonElement;
    const pageSizeSelect = this.element.querySelector('.data-den-pagination-page-size') as HTMLSelectElement;

    firstButton.addEventListener('click', () => {
      DataDenPubSub.publish('command:pagination:load-first-page:start', {
        context: new Context('command:pagination:load-first-page:start'),
      });
    });
    prevButton.addEventListener('click', () => {
      DataDenPubSub.publish('command:pagination:load-prev-page:start', {
        context: new Context('command:pagination:load-prev-page:start'),
      });
    });
    nextButton.addEventListener('click', () => {
      DataDenPubSub.publish('command:pagination:load-next-page:start', {
        context: new Context('command:pagination:load-next-page:start'),
      });
    });
    lastButton.addEventListener('click', () => {
      DataDenPubSub.publish('command:pagination:load-last-page:start', {
        context: new Context('command:pagination:load-last-page:start'),
      });
    });
    pageSizeSelect.addEventListener('change', (event: Event) => {
      const target = event.target as HTMLSelectElement;
      DataDenPubSub.publish('info:pagination:page-size-change:done', {
        pageSize: +target.value,
        context: new Context('info:pagination:page-size-change:done'),
      });
    });
  }

  destroy(): void {
    this.element.innerHTML = '';
    document.querySelector('.data-den-pagination')?.remove();
  }

  private subscribeToEvents(): void {
    DataDenPubSub.subscribe(
      'info:pagination:info-change:done',
      (event: { data: { firstRowIndex: number; lastRowIndex: number; allTotalRows: number; pageSize: number } }) => {
        this.updateInfo(event.data.firstRowIndex, event.data.lastRowIndex, event.data.allTotalRows);
        this.updatePageSize(event.data.pageSize);
      }
    );
  }

  private updateInfo(firstRowIndex: number, lastRowIndex: number, allTotalRows: number): void {
    const info = this.element.querySelector('.data-den-pagination-info');
    info!.innerHTML = `${firstRowIndex}-${lastRowIndex} ${this.options.ofText || 'of'} ${allTotalRows}`;
  }

  private updatePageSize(pageSize: number): void {
    const pageSizeSelect = this.element.querySelector('.data-den-pagination-page-size') as HTMLSelectElement;
    pageSizeSelect.value = pageSize.toString();
  }
}
