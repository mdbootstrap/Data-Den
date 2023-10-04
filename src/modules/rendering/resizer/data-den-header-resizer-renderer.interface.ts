export abstract class DataDenHeaderResizerRenderer {
  abstract getGui(): HTMLElement;
  abstract destroy?(): void;
}
