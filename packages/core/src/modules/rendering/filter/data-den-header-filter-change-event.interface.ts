import { DataDenPublishedEvent } from '../../../data-den-published-event';

export interface DataDenHeaderFilterChangeEvent extends DataDenPublishedEvent {
  field: string;
  type: string;
  state: any;
  isActive: boolean;
  filterFn: (state: any, value: any) => boolean;
}
