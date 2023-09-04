export abstract class DataDenHeaderFilterRenderer {
  abstract getGui(): HTMLElement;
  abstract destroy?(): void;
  protected filter(params: any): void {
    console.log(params);
  }
}
