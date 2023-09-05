export interface DataDenActiveHeaderFilter {
  type: string;
  method: string;
  searchTerm: any;
  caseSensitive: boolean;
  filterFn: (searchTerm: any, value: any) => boolean;
}
