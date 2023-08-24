export interface DataDenHeaderFilterRenderer {
  getGui(): HTMLElement;
  destroy?(): void;
  filter(params: any): void;
}
