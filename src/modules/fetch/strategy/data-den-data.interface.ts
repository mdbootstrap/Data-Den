import { Context } from '../../../context';
import { DataDenColDef } from '../../../data-den-options.interface';
import { Order } from '../../sorting';

export interface DataDenData<TData = any> {
  rows: TData[];
  columns: DataDenColDef[];
}

export interface DataDenSortOptions {
  context: Context;
  field: string;
  order: Order;
}

export interface DataDenFetchOptions {
  sortOptions: DataDenSortOptions;
  filterOptions: string;
  paginationOptions?: {
    pageSize?: number;
    pageSizeOptions?: number[];
    ofText?: string;
  };
}
