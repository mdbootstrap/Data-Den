import { DataDenColDef } from "../../data-den-options.interface";

export interface DataDenActiveQuickFilter {
  searchTerm: any;
  columns: DataDenColDef[];
  filterFn: (searchTerm: any, value: any, columns: DataDenColDef[]) => boolean;
}
