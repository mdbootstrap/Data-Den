import { DataDenPubSub } from './data-den-pub-sub';
import { DataDenPublishedHtmlEvent } from './data-den-published-event';

export class DataDenEventEmitter extends DataDenPubSub {
  static publish(name: string, data: DataDenPublishedHtmlEvent) {
    const { element } = data;

    if (!element) {
      return;
    }

    const event = new CustomEvent(name, {
      detail: data,
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(event);
  }
}
