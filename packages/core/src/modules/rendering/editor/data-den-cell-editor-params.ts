export interface DataDenCellEditorParams {
  value: any;
  cssPrefix: string;
  stopEditMode: (value: string) => void;
  setValue: (value: string) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onBlur: (event: FocusEvent) => void;
}
