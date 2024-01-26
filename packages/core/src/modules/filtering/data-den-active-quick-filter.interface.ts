import { DataDenActiveFilterParams, DataDenColDef } from '../../data-den-options.interface';

export interface DataDenActiveQuickFilter {
  searchTerm: any;
  columns: DataDenColDef[];
  filterFn: (params: DataDenActiveFilterParams) => boolean;
}
