export abstract class DataDenHeaderFilterRenderer {
  abstract getGui(): HTMLElement;
  abstract destroy?(): void;
  abstract getType(): string;
  abstract getState(): any;
  abstract isActive(): boolean;
  abstract getFilterFn(): (state: any, value: any) => boolean;
}
