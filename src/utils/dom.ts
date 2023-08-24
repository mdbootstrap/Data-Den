export function createHtmlElement(template: string): HTMLElement {
  const placeholder = document.createElement('div');
  placeholder.innerHTML = template;

  return placeholder.firstElementChild as HTMLElement;
}
