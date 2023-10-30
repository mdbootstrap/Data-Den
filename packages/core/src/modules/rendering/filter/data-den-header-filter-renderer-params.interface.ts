import { DataDenListOption } from '../../../data-den-options.interface';

export interface DataDenHeaderFilterRendererParams {
  field: string;
  debounceTime: number;
  method: string;
  cssPrefix: string;
  listOptions: DataDenListOption[];
}
