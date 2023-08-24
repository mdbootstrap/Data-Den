import { createHtmlElement } from '../../../utils';
import { DataDenHeaderSorterRenderer } from './data-den-header-sorter-renderer.interface';

export class DataDenHeaderDefaultSorterRenderer implements DataDenHeaderSorterRenderer {
  element: HTMLElement;

  constructor() {
    const template = `<div class="data-den-header-sorter"><div class="data-den-header-sorter-arrow"></div></div>`;

    this.element = createHtmlElement(template);
  }

  getGui(): HTMLElement {
    return this.element;
  }

  sort(): void {}
}
