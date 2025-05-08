export const groupRows = (rows: any[], groups: string[]) => {
  const res = groupRowsByGroups(rows, groups, groups.length, 0);

  return res;
}

// recursive function to group rows by groups
function groupRowsByGroups(data: any[], groups: string[], length: number, cur: number) {
  if (cur === length) {
    return data;
  }

  const groupedData = data.reduce((acc, obj) => {
    const key = obj[groups[cur]];
    acc[key] = acc[key] || [];
    acc[key].push(obj);
    return acc;
  }, {});

  for (const key in groupedData) {
    groupedData[key] = groupRowsByGroups(groupedData[key], groups, length, cur + 1);
  }

  return groupedData;
}

export const transformGroupedData = (rows: any, groupedColumns: any) => {
  const result: any = [];

  function recursiveTransform(data: any, level: number) {
    if (Array.isArray(data)) {
      data.forEach(item => result.push(item));
    } else {
      for (const key in data) {
        const col = groupedColumns[level];
        result.push({ _group: key, _colIndex: col.colIndex, _level: level, _column: col.group });
        recursiveTransform(data[key], level + 1);
      }
    }
  }

  recursiveTransform(rows, 0);

  return result;
}

export const countNumOfLevels = (data: any) => {
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].hasOwnProperty('_group')) {
      count++;
    } else {
      break;
    }
  }
  return count;
}