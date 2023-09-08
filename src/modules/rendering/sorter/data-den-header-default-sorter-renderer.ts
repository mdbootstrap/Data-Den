import { createHtmlElement } from '../../../utils';
import { DataDenHeaderSorterRenderer } from './data-den-header-sorter-renderer.interface';
import { DataDenPubSub } from './../../../data-den-pub-sub';
import { Context } from '../../../context';
import { Order } from '../../sorting/data-den-sorting.interface';

const SORTER_CLASS = 'data-den-header-sorter';
const SORTER_ARROW_CLASS = `${SORTER_CLASS}-arrow`;
const SORTER_ARROW_ASC_CLASS = `${SORTER_ARROW_CLASS}-asc`;
const SORTER_ARROW_DESC_CLASS = `${SORTER_ARROW_CLASS}-desc`;

const SORTER_ARROW_SELECTOR = `.${SORTER_ARROW_CLASS}`;

export class DataDenHeaderDefaultSorterRenderer implements DataDenHeaderSorterRenderer {
  element: HTMLElement;
  #field: string;

  constructor(field: string, order: Order) {
    const template = `
      <div class="${SORTER_CLASS}">
        <div class="${SORTER_ARROW_CLASS} ${order ? `${SORTER_ARROW_CLASS}-${order}` : ''}">
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
    const arrowEl = this.element.querySelector(`${SORTER_ARROW_SELECTOR}`);

    [`${SORTER_ARROW_ASC_CLASS}`, `${SORTER_ARROW_DESC_CLASS}`].forEach((className) => {
      arrowEl?.classList.remove(className);
    });
  }

  sort(): void {
    DataDenPubSub.publish('command:fetch:getSortedData', {
      caller: this,
      context: new Context('command:fetch:getSortedData'),
      field: this.#field,
    });
  }

  #updateArrowDirectionAfterSort(): void {
    DataDenPubSub.subscribe('info:sorting:done', (event: any) => {
      const arrowEl = this.element.querySelector(`${SORTER_ARROW_SELECTOR}`);

      if (event.data.field === this.#field && event.data.order) {
        this.#removeSorterArrowOrderClass();
        arrowEl?.classList.add(`${SORTER_ARROW_CLASS}-${event.data.order}`);
      } else {
        this.#removeSorterArrowOrderClass();
      }
    });
  }
}
