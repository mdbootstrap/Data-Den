import { DataDenSortComparator } from '../../data-den-options.interface';

export type DataDenSortOrder = 'asc' | 'desc' | '';

export interface DataDenSortingEvent {
  name: string;
  field: string;
  order: DataDenSortOrder;
  sortFn: (rows: any, field: string, order: DataDenSortOrder, comparator: DataDenSortComparator) => any[];
  preventDefault: () => void;
  defaultPrevented: boolean;
}
