export const normalizeRating = (value, min = 0, max = 5) => {
  let n = parseInt(value, 10);
  if (Number.isNaN(n)) {
    n = 0;
  }
  if (n < min) {
    return min;
  }
  if (n > max) {
    return max;
  }
  return n;
};
