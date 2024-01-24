import { createHtmlElement } from '../../../utils';
import { DataDenHeaderSorterRenderer } from './data-den-header-sorter-renderer.interface';
import { DataDenPubSub } from './../../../data-den-pub-sub';
import { Context } from '../../../context';
import { DataDenSortOrder } from '../../sorting/data-den-sorting.interface';
import { DataDenActiveSorter } from '../../sorting';
import { DataDenEvent } from '../../../data-den-event';
import { DataDenInternalOptions } from '../../../data-den-options.interface';

export class DataDenHeaderDefaultSorterRenderer extends DataDenHeaderSorterRenderer {
  arrowElement: HTMLElement;
  element: HTMLElement;
  #field: string;
  #cssPrefix: string;
  #multiSortKey: 'shift' | 'ctrl';
  #multiSortActive: boolean;

  constructor(field: string, order: DataDenSortOrder, private PubSub: DataDenPubSub, options: DataDenInternalOptions) {
    super();
    this.#cssPrefix = options.cssPrefix;
    const template = `
      <div class="${this.#cssPrefix}header-sorter">
        <div
          ref="sorterArrow"
          class="${this.#cssPrefix}header-sorter-arrow ${this.#cssPrefix}header-sorter-arrow-${order}"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            class="${this.#cssPrefix}header-sorter-arrow-svg"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M7.25 9.75 12 3m0 0 4.75 6.75M12 3v18"
            />
          </svg>
        </div>
        <div ref="sorterIndex" class="${this.#cssPrefix}header-sorter-index"></div>
      </div>
    `;
    this.#field = field;

    this.#multiSortActive = options.multiSort;
    this.#multiSortKey = options.multiSortKey;
    this.element = createHtmlElement(template);
    this.arrowElement = this.element.querySelector('[ref="sorterArrow"]')!;
    this.element.addEventListener('click', (event: any) => {
      const isMultiSortKeyPressed = this.#multiSortKey === 'shift' ? event.shiftKey : event.ctrlKey;
      const isMultiSort = this.#multiSortActive && isMultiSortKeyPressed;

      // Prevent text selection
      window.getSelection().removeAllRanges();

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
