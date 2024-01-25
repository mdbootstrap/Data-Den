export interface DataDenCellRenderer {
  getGui(): HTMLElement;
  destroy?(): void;
}
