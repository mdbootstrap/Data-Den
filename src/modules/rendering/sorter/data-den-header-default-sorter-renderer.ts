import { createHtmlElement } from '../../../utils';
import { DataDenHeaderSorterRenderer } from './data-den-header-sorter-renderer.interface';
import { DataDenPubSub } from './../../../data-den-pub-sub';
import { Context } from '../../../context';
import { Order } from '../../sorting/data-den-sorting.interface';

export class DataDenHeaderDefaultSorterRenderer extends DataDenHeaderSorterRenderer {
  arrowElement: HTMLElement;
  element: HTMLElement;
  #field: string;

  constructor(field: string, order: Order) {
    super();
    const template = `
      <div class="data-den-header-sorter">
        <div ref="sorterArrow" class="data-den-header-sorter-arrow data-den-header-sorter-arrow-${order}">
        </div>
      </div>
    `;
    this.#field = field;

    this.element = createHtmlElement(template);
    this.arrowElement = this.element.querySelector('[ref="sorterArrow"]')!;
    this.element.addEventListener('click', () => this.sort());
    this.element.addEventListener('click', () => this.#updateArrowDirectionAfterSort());
  }

  destroy?(): void {
    throw new Error('Method not implemented.');
  }

  getGui(): HTMLElement {
    return this.element;
  }

  #getUpdatedSortOrder(): Order {
    const classList = this.arrowElement.classList;
    if (classList.contains('data-den-header-sorter-arrow-asc')) {
      return 'desc';
    } else if (classList.contains('data-den-header-sorter-arrow-desc')) {
      return '';
    } else {
      return 'asc';
    }
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
    const arrowElements = document.querySelectorAll('[ref="sorterArrow"]');
    const order = this.#getUpdatedSortOrder();

    arrowElements.forEach((arrowElement) => {
      arrowElement.classList.remove('data-den-header-sorter-arrow-asc', 'data-den-header-sorter-arrow-desc');
    });

    this.arrowElement.classList.add(`data-den-header-sorter-arrow-${order}`);
  }
}
