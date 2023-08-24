export interface DataDenHeaderSorterRenderer {
  getGui(): HTMLElement;
  destroy?(): void;
  sort(params: any): void;
}
