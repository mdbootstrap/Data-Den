export interface DataDenCellRenderer {
  getGui(focus?: boolean): HTMLElement;
  destroy?(): void;
}
