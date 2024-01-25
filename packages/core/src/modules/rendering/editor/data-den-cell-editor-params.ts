export interface DataDenCellEditorParams {
  value: any;
  cssPrefix: string;
  stopEditMode: () => void;
  onKeyUp: (event: KeyboardEvent) => void;
}
