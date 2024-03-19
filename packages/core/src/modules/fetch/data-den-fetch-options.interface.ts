import { DataDenActiveFilterParams, DataDenColDef, DataDenSortComparator } from '../../data-den-options.interface';
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
  columns: DataDenColDef[];
  filterFn: (params: DataDenActiveFilterParams) => boolean;
}

export interface DataDenFiltersOptions {
  filters: { [key: string]: DataDenActiveHeaderFilter };
}

export interface DataDenPaginationOptions {
  firstRowIndex: number;
  lastRowIndex: number;
}

export interface DataDenGroupedOptions {
  groupedColumns?: any[];
}

export interface DataDenFetchOptions {
  sortingOptions?: DataDenSortOptions;
  quickFilterOptions?: DataDenQuickFilterOptions;
  filtersOptions?: DataDenFiltersOptions;
  paginationOptions?: DataDenPaginationOptions;
  groupedOptions?: DataDenGroupedOptions;
}
