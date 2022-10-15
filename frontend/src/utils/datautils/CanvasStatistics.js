import Color from "./Color";

export function averageColors(colors) {
  return new Color(
    calcAverage(colors.map(c => c.r)),
    calcAverage(colors.map(c => c.g)),
    calcAverage(colors.map(c => c.b)),
  )
}

export const calcAverage = array => array.reduce((a, b) => a + b) / array.length;
export const calcVariance = (arr = []) => {
  if(!arr.length){
     return 0;
  };
  const sum = arr.reduce((acc, val) => acc + val);
  const { length: num } = arr;
  const median = sum / num;
  let variance = 0;
  arr.forEach(num => {
     variance += ((num - median) * (num - median));
  });
  variance /= num;
  return variance;
};

export default class CanvasStatistics {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
  }

  flattenRGB() {
    const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const rValues = []
    const gValues = []
    const bValues = []
    for (let x = 0; x < imageData.width; x++) {
      for (let y = 0; y < imageData.width; y++) {
        // r = 0, g = 1, b = 2, a = 3
        rValues.push(imageData.data[x * (imageData.width * 4) + y * 4]);
        gValues.push(imageData.data[x * (imageData.width * 4) + y * 4 + 1]);
        bValues.push(imageData.data[x * (imageData.width * 4) + y * 4 + 2]);
      }
    }
    return {rValues, gValues, bValues};
  }

  stats() {
    const {rValues, gValues, bValues} = this.flattenRGB();
    const variance = new Color(calcVariance(rValues), calcVariance(gValues), calcVariance(bValues));
    const average = new Color(calcAverage(rValues), calcAverage(gValues), calcAverage(bValues));
    return {variance, average}
  }
}