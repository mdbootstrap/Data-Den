export interface DataDenCellEditorParams {
  valueSetter: (value: string) => any;
  valueParser: (value: string) => any;
  value: any;
  cssPrefix: string;
}
