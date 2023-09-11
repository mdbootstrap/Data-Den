import { DataDenPublishedEvent } from '../../data-den-published-event';
import { DataDenActiveHeaderFilter } from './data-den-active-header-filter.interface';

export interface DataDenActiveFiltersChangeEvent extends DataDenPublishedEvent {
  filters: { [key: string]: DataDenActiveHeaderFilter };
}
