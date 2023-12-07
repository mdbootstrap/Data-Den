import { createHtmlElement } from '../../../utils';
import { DataDenHeaderSorterRenderer } from './data-den-header-sorter-renderer.interface';
import { DataDenPubSub } from './../../../data-den-pub-sub';
import { Context } from '../../../context';
import { DataDenSortOrder } from '../../sorting/data-den-sorting.interface';

export class DataDenHeaderDefaultSorterRenderer extends DataDenHeaderSorterRenderer {
  arrowElement: HTMLElement;
  element: HTMLElement;
  #field: string;
  #cssPrefix: string;
  private PubSub: DataDenPubSub;

  constructor(field: string, order: DataDenSortOrder, cssPrefix: string) {
    super();
    this.#cssPrefix = cssPrefix;
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
    this.PubSub.publish(command, {
      caller: this,
      context: new Context(command),
      field: this.#field,
    });
  }

  #subscribeSortingStartEvent(): void {
    this.PubSub.subscribe('command:fetch:sort-start', (event) => {
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
