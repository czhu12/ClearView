export const variance = (arr) => {
  if(!arr.length){
     return 0;
  };
  const sum = arr.reduce((acc, val) => acc + val);
  const { length: num } = arr;
  const mean = sum / num;
  let variance = 0;
  arr.forEach(num => {
     variance += ((num - mean) * (num - mean));
  });
  variance /= num;
  return variance;
};
