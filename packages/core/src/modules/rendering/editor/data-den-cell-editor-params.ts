export interface DataDenCellEditorParams {
  value: any;
  cssPrefix: string;
  stopEditMode: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onBlur: (event: FocusEvent) => void;
}
