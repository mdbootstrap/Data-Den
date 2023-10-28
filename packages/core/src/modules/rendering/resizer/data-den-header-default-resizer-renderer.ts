import { createHtmlElement } from '../../../utils';
import { DataDenHeaderResizerRenderer } from './data-den-header-resizer-renderer.interface';
import { DataDenPubSub } from '../../../data-den-pub-sub';
import { Context } from '../../../context';

export class DataDenHeaderDefaultResizerRenderer implements DataDenHeaderResizerRenderer {
  element: HTMLElement;
  #cssPrefix: string;

  constructor(cssPrefix: string) {
    this.#cssPrefix = cssPrefix;

    const template = `<div class="${this.#cssPrefix}header-resizer"></div>`;

    this.element = createHtmlElement(template);
    this.element.addEventListener('mousedown', this.#onMouseDown);
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
