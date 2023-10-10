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

  constructor(field: string, order: Order, cssClassPrefix: string) {
    super();
    this.#cssPrefix = cssClassPrefix;
    const template = `
      <div class="${this.#cssPrefix}header-sorter">
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
    if (classList.contains(`${this.#cssPrefix}header-sorter-arrow-asc`)) {
      return 'desc';
    } else if (classList.contains(`${this.#cssPrefix}header-sorter-arrow-desc`)) {
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
      arrowElement.classList.remove(
        `${this.#cssPrefix}header-sorter-arrow-asc`,
        `${this.#cssPrefix}header-sorter-arrow-desc`
      );
    });

    this.arrowElement.classList.add(`${this.#cssPrefix}header-sorter-arrow-${order}`);
  }
}
