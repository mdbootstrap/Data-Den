export interface DataDenActiveHeaderFilter {
  type: string;
  state: any;
  filterFn: (searchTerm: any, value: any) => boolean;
}
