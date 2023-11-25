import { DataDenColDef } from '../data-den-options.interface';

// Get Elements
export const getPinnedLeftColumns = (columns: DataDenColDef[]) => {
  return columns.filter((col) => col.pinned === 'left');
};

export const getMainColumns = (columns: DataDenColDef[]) => {
  return columns.filter((col) => !col.pinned);
};

export const getPinnedRightColumns = (columns: DataDenColDef[]) => {
  return columns.filter((col) => col.pinned === 'right');
};

// Get Indexes
export const getMainColumnIndexes = (columns: DataDenColDef[]) => {
  return getMainColumns(columns).map((col) => columns.indexOf(col));
};

export const getMainOrderedColumns = (columns: DataDenColDef[]) => {
  return getMainColumnIndexes(columns).map((index) => columns[index]);
};

// Get Orders
export const getPinnedLeftColumnsOrder = (columns: DataDenColDef[]) => {
  return getPinnedLeftColumns(columns).map((_, key) => key);
};

export const getMainColumnsOrder = (columns: DataDenColDef[]) => {
  return getMainColumns(columns).map((_, key) => key);
};

export const getPinnedRightColumnsOrder = (columns: DataDenColDef[]) => {
  return getPinnedRightColumns(columns).map((_, key) => key);
};

export const getAllColumnsOrder = (columns: DataDenColDef[]) => {
  return [
    ...getPinnedLeftColumns(columns).map((col) => columns.indexOf(col)),
    ...getMainColumns(columns).map((col) => columns.indexOf(col)),
    ...getPinnedRightColumns(columns).map((col) => columns.indexOf(col)),
  ];
};
