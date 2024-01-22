import { isObject } from './object';

const getSortOptions = (arr: string[]) => {
  const distinctElements: string[] = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    if (!distinctElements.includes(arr[i])) {
      distinctElements.unshift(arr[i]);
    }
  }
  return distinctElements;
};

export const deepMerge = (object: any, source: any) => {
  if (!isObject(object) || !isObject(source)) {
    return source;
  }

  Object.keys(source).forEach((key) => {
    const objValue = object[key];
    const srcValue = source[key];

    if (Array.isArray(objValue) && Array.isArray(srcValue)) {
      object[key] = objValue.concat(srcValue);
      if (key !== 'sortOptions') return;

      object[key] = getSortOptions(objValue.concat(srcValue));
    } else if (isObject(objValue) && isObject(srcValue)) {
      object[key] = deepMerge(Object.assign({}, objValue), srcValue);
    } else {
      object[key] = srcValue;
    }
  });

  return object;
};
