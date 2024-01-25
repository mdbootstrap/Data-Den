export interface DataDenCellEditorParams {
  value: any;
  cssPrefix: string;
  onKeyDown: (event: KeyboardEvent) => void;
  onBlur: (event: FocusEvent) => void;
}
