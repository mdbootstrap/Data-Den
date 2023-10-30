export type Order = 'asc' | 'desc' | '';

export interface DataDenSortingEvent {
  name: string;
  field: string;
  order: Order;
  sortFn: (rows: any, field: string, order: string) => any[];
  preventDefault: () => void;
  defaultPrevented: boolean;
}
