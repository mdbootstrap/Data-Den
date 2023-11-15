import { createHtmlElement } from '../../../utils';
import { DataDenHeaderSorterRenderer } from './data-den-header-sorter-renderer.interface';
import { DataDenPubSub } from './../../../data-den-pub-sub';
import { Context } from '../../../context';
import { Order } from '../../sorting/data-den-sorting.interface';

export class DataDenHeaderDefaultSorterRenderer extends DataDenHeaderSorterRenderer {
  arrowElement: HTMLElement;
  element: HTMLElement;
  #field: string;
  #cssPrefix: string;

  constructor(field: string, order: Order, cssPrefix: string) {
    super();
    this.#cssPrefix = cssPrefix;
    const template = `
      <div class="${this.#cssPrefix}header-sorter">
      <div>
        <select id=${field} name="sorting" class="sortingSelect">
          <option value="asc-desc">asc -> desc -> null </option>
          <option value="desc-asc">desc -> asc -> null</option>
        </select>
      </div>
      <div
          ref="sorterArrow"
          class="${this.#cssPrefix}header-sorter-arrow ${this.#cssPrefix}header-sorter-arrow-${order}"
        >
        </div>
      </div>
    `;
    this.#field = field;

    this.element = createHtmlElement(template);
    this.arrowElement = this.element.querySelector('[ref="sorterArrow"]')!;
    this.arrowElement.addEventListener('click', () => this.sort());
    this.#subscribeSortingStartEvent();
  }

  destroy?(): void {
    throw new Error('Method not implemented.');
  }

  getGui(): HTMLElement {
    return this.element;
  }

  sort(): void {
    const command = 'command:sorting:start';
    DataDenPubSub.publish(command, {
      caller: this,
      context: new Context(command),
      field: this.#field,
    });
  }

  #subscribeSortingStartEvent(): void {
    DataDenPubSub.subscribe('command:fetch:sort-start', (event) => {
      if (this.#field === event.data.field) {
        this.#updateArrowDirectionAfterSort(event.data.order);
      }
    });
  }

  #updateArrowDirectionAfterSort(order: string): void {
    const arrowElements = document.querySelectorAll('[ref="sorterArrow"]');

    arrowElements.forEach((arrowElement) => {
      arrowElement.classList.remove(
        `${this.#cssPrefix}header-sorter-arrow-asc`,
        `${this.#cssPrefix}header-sorter-arrow-desc`
      );
    });

    this.arrowElement.classList.add(`${this.#cssPrefix}header-sorter-arrow-${order}`);
  }
}
