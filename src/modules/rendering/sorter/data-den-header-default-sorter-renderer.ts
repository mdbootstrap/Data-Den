import { createHtmlElement } from '../../../utils';
import { DataDenHeaderSorterRenderer } from './data-den-header-sorter-renderer.interface';
import { DataDenPubSub } from './../../../data-den-pub-sub';
import { Context } from '../../../context';
import { Order } from '../../sorting/data-den-sorting.interface';

export class DataDenHeaderDefaultSorterRenderer implements DataDenHeaderSorterRenderer {
  element: HTMLElement;
  #field: string;

  constructor(field: string, order: Order, rows: any[]) {
    const template = `
      <div class="data-den-header-sorter">
        <div class="data-den-header-sorter-arrow ${order ? `data-den-header-sorter-arrow-${order}` : ''}">
        </div>
      </div>
    `;
    this.#field = field;

    this.element = createHtmlElement(template);
    this.element.addEventListener('click', () => this.sort(rows));
  }

  getGui(): HTMLElement {
    return this.element;
  }

  sort(rows: any[]): void {
    DataDenPubSub.publish('command:sorting:start', {
      caller: this,
      context: new Context('command:sorting:start'),
      field: this.#field,
      rows,
    });
  }
}
