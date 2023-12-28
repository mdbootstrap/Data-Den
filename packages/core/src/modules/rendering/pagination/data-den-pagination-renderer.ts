import { createHtmlElement } from '../../../utils';
import { DataDenPubSub } from '../../../data-den-pub-sub';
import { DataDenPaginationOptions } from '../../../data-den-options.interface';
import { Context } from '../../../context';

export class DataDenPaginationRenderer {
  element: HTMLElement;
  options: DataDenPaginationOptions;
  buttons: Record<string, HTMLButtonElement>;

  constructor(options: DataDenPaginationOptions, private PubSub: DataDenPubSub) {
    this.options = options;

    const template =
      /* HTML */
      `<div class="data-den-pagination">
        <div class="data-den-pagination-content" ref="paginationContent">
          <button class="data-den-pagination-first-button"><<</button>
          <button class="data-den-pagination-prev-button"><</button>
          <div class="data-den-pagination-info">1-10 ${this.options.ofText || 'of'} 100</div>
          <button class="data-den-pagination-next-button">></button>
          <button class="data-den-pagination-last-button">>></button>
        </div>
      </div>`;

    this.element = createHtmlElement(template);
    this.buttons = {
      first: this.element.querySelector('.data-den-pagination-first-button') as HTMLButtonElement,
      prev: this.element.querySelector('.data-den-pagination-prev-button') as HTMLButtonElement,
      next: this.element.querySelector('.data-den-pagination-next-button') as HTMLButtonElement,
      last: this.element.querySelector('.data-den-pagination-last-button') as HTMLButtonElement,
    };
    this.attachUiEvents();
    this.subscribeToEvents();
  }

  getGui(): HTMLElement {
    return this.element;
  }

  attachUiEvents(): void {
    this.buttons.first.addEventListener('click', () => {
      this.PubSub.publish('command:pagination:load-first-page:start', {
        context: new Context('command:pagination:load-first-page:start'),
      });
    });
    this.buttons.prev.addEventListener('click', () => {
      this.PubSub.publish('command:pagination:load-prev-page:start', {
        context: new Context('command:pagination:load-prev-page:start'),
      });
    });
    this.buttons.next.addEventListener('click', () => {
      this.PubSub.publish('command:pagination:load-next-page:start', {
        context: new Context('command:pagination:load-next-page:start'),
      });
    });
    this.buttons.last.addEventListener('click', () => {
      this.PubSub.publish('command:pagination:load-last-page:start', {
        context: new Context('command:pagination:load-last-page:start'),
      });
    });
  }

  destroy(): void {
    this.element.innerHTML = '';
    document.querySelector('.data-den-pagination')?.remove();
  }

  private subscribeToEvents(): void {
    this.PubSub.subscribe(
      'info:pagination:info-change:done',
      (event: { data: { firstRowIndex: number; lastRowIndex: number; allTotalRows: number; pageSize: number } }) => {
        this.updateInfo(event.data.firstRowIndex, event.data.lastRowIndex, event.data.allTotalRows);
        this.updateButtonsState(event.data.firstRowIndex, event.data.lastRowIndex, event.data.allTotalRows);
      }
    );
  }

  private updateButtonsState(firstRowIndex: number, lastRowIndex: number, allTotalRows: number): void {
    Object.values(this.buttons).forEach((button: HTMLButtonElement) => (button.disabled = false));

    if (firstRowIndex === 0) {
      this.buttons.first.disabled = true;
      this.buttons.prev.disabled = true;
    }

    if (lastRowIndex === allTotalRows) {
      this.buttons.next.disabled = true;
      this.buttons.last.disabled = true;
    }
  }

  private updateInfo(firstRowIndex: number, lastRowIndex: number, allTotalRows: number): void {
    const info = this.element.querySelector('.data-den-pagination-info');
    info!.innerHTML = `${firstRowIndex + 1}-${lastRowIndex} ${this.options.ofText || 'of'} ${allTotalRows}`;
  }

  public updatePageSize(pageSize: number): void {
    this.PubSub.publish('info:pagination:page-size-change:done', {
      pageSize: pageSize,
      context: new Context('info:pagination:page-size-change:done'),
    });
  }
}
