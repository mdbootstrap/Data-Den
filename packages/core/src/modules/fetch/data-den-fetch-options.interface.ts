import { DataDenSortComparator } from '../../data-den-options.interface';
import { DataDenActiveHeaderFilter } from '../filtering';
import { DataDenActiveSorter, DataDenSortOrder } from '../sorting';

export interface DataDenSortOptions {
  field: string;
  order: DataDenSortOrder;
  comparator: DataDenSortComparator;
  sortFn: (rows: any[], activeSorters: DataDenActiveSorter[]) => any[];
  activeSorters: DataDenActiveSorter[];
}

export interface DataDenQuickFilterOptions {
  searchTerm: string;
  filterFn: (searchTerm: any, value: any) => boolean;
}

export interface DataDenFiltersOptions {
  filters: { [key: string]: DataDenActiveHeaderFilter };
}

export interface DataDenPaginationOptions {
  firstRowIndex: number;
  lastRowIndex: number;
}

export interface DataDenFetchOptions {
  sortingOptions?: DataDenSortOptions;
  quickFilterOptions?: DataDenQuickFilterOptions;
  filtersOptions?: DataDenFiltersOptions;
  paginationOptions?: DataDenPaginationOptions;
}
