import { DataDenPublishedEvent } from '../../../data-den-published-event';

export interface DataDenQuickFilterChangeEvent extends DataDenPublishedEvent {
  searchTerm: any;
}
