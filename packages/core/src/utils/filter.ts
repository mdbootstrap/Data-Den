export function debounce(callback: any, debounceTime: number) {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: any) => {
    const debounceFn = () => {
      clearTimeout(timeout);
      callback(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(debounceFn, debounceTime);
  };
}
