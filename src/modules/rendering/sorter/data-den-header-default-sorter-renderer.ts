import { createHtmlElement } from '../../../utils';
import { DataDenHeaderSorterRenderer } from './data-den-header-sorter-renderer.interface';
import { DataDenPubSub } from './../../../data-den-pub-sub';
import { Context } from '../../../context';
import { Order } from '../../sorting/data-den-sorting.interface';

export class DataDenHeaderDefaultSorterRenderer implements DataDenHeaderSorterRenderer {
  element: HTMLElement;
  #field: string;

  constructor(field: string, order: Order) {
    const template = `
      <div class="data-den-header-sorter">
        <div ref="sorterArrow" class="data-den-header-sorter-arrow data-den-header-sorter-arrow-${order}">
        </div>
      </div>
    `;
    this.#field = field;

    this.element = createHtmlElement(template);
    this.element.addEventListener('click', () => this.sort());

    this.#updateArrowDirectionAfterSort();
  }
  destroy?(): void {
    throw new Error('Method not implemented.');
  }

  getGui(): HTMLElement {
    return this.element;
  }

  #removeSorterArrowOrderClass(): void {
    const arrowEl = this.element.querySelector('.data-den-header-sorter-arrow');

    ['data-den-header-sorter-arrow-asc', 'data-den-header-sorter-arrow-desc'].forEach((className) => {
      arrowEl?.classList.remove(className);
    });
  }

  sort(): void {
    const command = 'command:sorting:start';
    DataDenPubSub.publish(command, {
      caller: this,
      context: new Context(command),
      field: this.#field,
    });
  }

  #updateArrowDirectionAfterSort(): void {
    DataDenPubSub.subscribe('info:sorting:done', (event: any) => {
      const arrowEl = this.element.querySelector('[ref="sorterArrow"]') as HTMLElement;

      if (event.data.field === this.#field && event.data.order) {
        this.#removeSorterArrowOrderClass();
        arrowEl.classList.add(`data-den-header-sorter-arrow-${event.data.order}`);
      } else {
        this.#removeSorterArrowOrderClass();
      }
    });
  }
}
