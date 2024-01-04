export interface DataDenCellRenderer {
  getGui(): HTMLElement;
  destroy?(): void;
  setValue(value: string): void;
}
