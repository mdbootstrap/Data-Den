import { DataDenPublishedEvent } from '../../data-den-published-event';
import { DataDenData } from './strategy';

export interface DataDenFetchDoneEvent extends DataDenPublishedEvent {
  data: DataDenData;
}
