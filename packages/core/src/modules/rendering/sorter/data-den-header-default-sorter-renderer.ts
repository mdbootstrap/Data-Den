import { createHtmlElement } from '../../../utils';
import { DataDenHeaderSorterRenderer } from './data-den-header-sorter-renderer.interface';
import { DataDenPubSub } from './../../../data-den-pub-sub';
import { Context } from '../../../context';
import { DataDenSortOrder } from '../../sorting/data-den-sorting.interface';
import { DataDenActiveSorter } from '../../sorting';
import { DataDenEvent } from '../../../data-den-event';

export class DataDenHeaderDefaultSorterRenderer extends DataDenHeaderSorterRenderer {
  arrowElement: HTMLElement;
  element: HTMLElement;
  #field: string;
  #cssPrefix: string;
  #multiSortKey: 'shift' | 'ctrl';

  constructor(
    field: string,
    order: DataDenSortOrder,
    cssPrefix: string,
    private PubSub: DataDenPubSub,
    multiSortKey: 'shift' | 'ctrl'
  ) {
    super();
    this.#cssPrefix = cssPrefix;
    const template = `
      <div class="${this.#cssPrefix}header-sorter">
        <div ref="sorterIndex" class="${this.#cssPrefix}header-sorter-index"></div>
        <div
          ref="sorterArrow"
          class="${this.#cssPrefix}header-sorter-arrow ${this.#cssPrefix}header-sorter-arrow-${order}"
        >
        </div>
      </div>
    `;
    this.#field = field;

    this.#multiSortKey = multiSortKey;
    this.element = createHtmlElement(template);
    this.arrowElement = this.element.querySelector('[ref="sorterArrow"]')!;
    this.element.addEventListener('click', (event: any) => {
      const isMultiSort = this.#multiSortKey === 'shift' ? event.shiftKey : event.ctrlKey;

      this.sort(isMultiSort);
    });
    this.#subscribeSortingStartEvent();
  }

  destroy?(): void {
    throw new Error('Method not implemented.');
  }

  getGui(): HTMLElement {
    return this.element;
  }

  sort(isMultiSort: boolean): void {
    const command = 'command:sorting:start';
    this.PubSub.publish(command, {
      caller: this,
      context: new Context(command),
      field: this.#field,
      isMultiSort,
    });
  }

  #subscribeSortingStartEvent(): void {
    this.PubSub.subscribe('command:fetch:sort-start', (event: DataDenEvent) => {
      const { field, order, isMultiSort, activeSorters } = event.data;

      if (this.#field === field) {
        this.#updateArrowDirectionAfterSort(order, isMultiSort);
      }

      this.#updateSortIndexOrder(activeSorters);
    });
  }

  #updateArrowDirectionAfterSort(order: string, isMultiSort: boolean): void {
    if (!isMultiSort) {
      const arrowElements = document.querySelectorAll('[ref="sorterArrow"]');

      arrowElements.forEach((arrowElement) => {
        arrowElement.classList.remove(
          `${this.#cssPrefix}header-sorter-arrow-asc`,
          `${this.#cssPrefix}header-sorter-arrow-desc`
        );
      });
    }

    if (order === '' && isMultiSort) {
      this.arrowElement.classList.remove(
        `${this.#cssPrefix}header-sorter-arrow-asc`,
        `${this.#cssPrefix}header-sorter-arrow-desc`
      );
    }

    this.arrowElement.classList.add(`${this.#cssPrefix}header-sorter-arrow-${order}`);
  }

  #updateSortIndexOrder(activeSorters: DataDenActiveSorter[]) {
    const indexElement = this.element.querySelector('[ref="sorterIndex"]');
    const activeSorter = activeSorters.find((sorter: DataDenActiveSorter) => sorter.field === this.#field);

    if (activeSorters.length > 1 && activeSorter) {
      const sortIndexNumber = activeSorter.sortIndex + 1;
      indexElement.textContent = sortIndexNumber.toString();
    } else {
      indexElement.textContent = '';
    }
  }
}
