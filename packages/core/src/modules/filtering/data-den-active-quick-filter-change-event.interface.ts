import { DataDenPublishedEvent } from '../../data-den-published-event';
import { DataDenActiveQuickFilter } from './data-den-active-quick-filter.interface';

export interface DataDenActiveQuickFilterChangeEvent extends DataDenPublishedEvent {
  filter: DataDenActiveQuickFilter;
}
