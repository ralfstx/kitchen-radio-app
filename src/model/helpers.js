
export function splice(items, cols = 2) {
  if (cols <= 0) {
    throw new Error('columns must be >= 1');
  }
  let result = [];
  let row;
  items.forEach((item, index) => {
    if (index % cols === 0) {
      row = [];
      result.push(row);
    }
    row[index % cols] = item;
  });
  return result;
}
