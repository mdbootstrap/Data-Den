import { DataDenPublishedEvent } from '../../../data-den-published-event';

export interface DataDenHeaderFilterChangeEvent extends DataDenPublishedEvent {
  field: string;
  type: string;
  method: string;
  searchTerm: any;
}
