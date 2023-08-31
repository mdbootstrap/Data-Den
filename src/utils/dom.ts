export function createHtmlElement(template: string, elementName = 'div'): HTMLElement {
  const placeholder = document.createElement(elementName);
  placeholder.innerHTML = template;

  return placeholder.firstElementChild as HTMLElement;
}
