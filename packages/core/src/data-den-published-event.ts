import { Context } from './context';

export interface DataDenPublishedEvent {
  context: Context;
  [key: string]: any;
}

export interface DataDenPublishedHtmlEvent extends DataDenPublishedEvent {
  element: HTMLElement;
  [key: string]: any;
}
