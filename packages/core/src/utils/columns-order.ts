import { DataDenColDef } from '../data-den-options.interface';

export const getColumnsOrder = (columns: DataDenColDef[]) => {
  const fixedLeftColumns = columns.reduce((acc, curr, index) => {
    if (curr.fixed === 'left') {
      acc.push(index);
    }
    return acc;
  }, [] as number[]);
  const nonFixedColumns = columns.reduce((acc, curr, index) => {
    if (!curr.fixed) {
      acc.push(index);
    }
    return acc;
  }, [] as number[]);
  const fixedRightColumns = columns.reduce((acc, curr, index) => {
    if (curr.fixed === 'right') {
      acc.push(index);
    }
    return acc;
  }, [] as number[]);

  return [...fixedLeftColumns, ...nonFixedColumns, ...fixedRightColumns.reverse()];
};

export const getOrderedColumns = (columns: DataDenColDef[]) => {
  return getColumnsOrder(columns).map((index) => columns[index]);
};
