import { createHtmlElement } from '../../../utils';
import { DataDenHeaderResizerRenderer } from './data-den-header-resizer-renderer.interface';
import { DataDenPubSub } from '../../../data-den-pub-sub';
import { Context } from '../../../context';
import { DataDenColDef } from '../../../data-den-options.interface';

export class DataDenHeaderDefaultResizerRenderer implements DataDenHeaderResizerRenderer {
  element: HTMLElement;
  #cssPrefix: string;
  #isFixedRight: boolean;

  constructor(cssPrefix: string, colDef: DataDenColDef) {
    this.#cssPrefix = cssPrefix;
    this.#isFixedRight = colDef.fixed === 'right';

    const template = `<div class="${this.#cssPrefix}header-resizer ${
      this.#isFixedRight ? this.#cssPrefix + 'header-resizer-left' : ''
    }"></div>`;

    this.element = createHtmlElement(template);
    this.element.addEventListener('mousedown', (event) => this.#onMouseDown(event));
    document.addEventListener('mousemove', this.#resize);
    document.addEventListener('mouseup', this.#onMouseUp);
  }

  getGui(): HTMLElement {
    return this.element;
  }

  #onMouseDown(event: MouseEvent): void {
    event.stopPropagation();

    DataDenPubSub.publish('info:resizing:mousedown', {
      target: event.target,
      isFixedRight: this.#isFixedRight,
      context: new Context('info:resizing:mousedown'),
    });
  }

  #onMouseUp(): void {
    DataDenPubSub.publish('info:resizing:mouseup', {
      context: new Context('info:resizing:mouseup'),
    });
  }

  #resize(event: MouseEvent): void {
    DataDenPubSub.publish('command:resizing:start', {
      event,
      context: new Context('command:resizing:start'),
    });
  }
}
