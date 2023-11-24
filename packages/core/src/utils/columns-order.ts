import { DataDenColDef } from '../data-den-options.interface';

export const getFixedColumnsLeft = (columns: DataDenColDef[]) => {
  return columns.filter((col) => col.fixed === 'left');
};

export const getNonFixedColumns = (columns: DataDenColDef[]) => {
  return columns.filter((col) => !col.fixed);
};

export const getFixedColumnsRight = (columns: DataDenColDef[]) => {
  return columns.filter((col) => col.fixed === 'right');
};

export const getColumnsOrder = (columns: DataDenColDef[]) => {
  return getNonFixedColumns(columns).map((col) => columns.indexOf(col));
};

export const getAllColumnsOrder = (columns: DataDenColDef[]) => {
  return [
    ...getFixedColumnsLeft(columns).map((col) => columns.indexOf(col)),
    ...getNonFixedColumns(columns).map((col) => columns.indexOf(col)),
    ...getFixedColumnsRight(columns).map((col) => columns.indexOf(col)),
  ];
};

export const getOrderedColumns = (columns: DataDenColDef[]) => {
  return getColumnsOrder(columns).map((index) => columns[index]);
};

export const getFixedLeftColumnsOrder = (columns: DataDenColDef[]) => {
  return getFixedColumnsLeft(columns).map((_, key) => key);
};

export const getNonFixedColumnsOrder = (columns: DataDenColDef[]) => {
  return getNonFixedColumns(columns).map((_, key) => key);
};

export const getFixedRightColumnsOrder = (columns: DataDenColDef[]) => {
  return getFixedColumnsRight(columns).map((_, key) => key);
};
