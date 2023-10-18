import { DataDenPublishedEvent } from '../../data-den-published-event';

export interface DataDenFetchDoneEvent extends DataDenPublishedEvent {
  rows: any[];
}
