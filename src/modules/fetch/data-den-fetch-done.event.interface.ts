import { DataDenColDef, DataDenRowDef } from '../../data-den-options.interface';
import { DataDenPublishedEvent } from '../../data-den-published-event';

export interface DataDenFetchDoneEvent extends DataDenPublishedEvent {
  rows: DataDenRowDef[];
  columns: DataDenColDef[];
}
