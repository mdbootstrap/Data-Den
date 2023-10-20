import { DataDenActiveHeaderFilter } from '../filtering';
import { Order } from '../sorting';

export interface DataDenSortOptions {
  field: string;
  order: Order;
  sortFn: (rows: any[], field: string, order: Order) => any[];
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
