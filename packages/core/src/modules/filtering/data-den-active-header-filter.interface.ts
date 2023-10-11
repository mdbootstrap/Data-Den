export interface DataDenActiveHeaderFilter {
  type: string;
  method: string;
  searchTerm: any;
  filterFn: (searchTerm: any, value: any) => boolean;
}
