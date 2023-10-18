import { isObject } from './object';

export const deepMerge = (object: any, source: any) => {
  if (!isObject(object) || !isObject(source)) {
    return source;
  }

  Object.keys(source).forEach((key) => {
    const objValue = object[key];
    const srcValue = source[key];

    if (Array.isArray(objValue) && Array.isArray(srcValue)) {
      object[key] = objValue.concat(srcValue);
    } else if (isObject(objValue) && isObject(srcValue)) {
      object[key] = deepMerge(Object.assign({}, objValue), srcValue);
    } else {
      object[key] = srcValue;
    }
  });

  return object;
};
