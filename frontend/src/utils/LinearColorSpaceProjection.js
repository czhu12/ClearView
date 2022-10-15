import CanvasStatistics, { calcAverage, averageColors } from "./datautils/CanvasStatistics";
import Color from "./datautils/Color";


function getColorIndicesForCoord(x, y, width) {
  const red = y * (width * 4) + x * 4;
  return [red, red + 1, red + 2, red + 3];
};

function getPixelAtCoordinate(x, y, imageData) {
  const coords = getColorIndicesForCoord(x, y, imageData.width);
  return new Color(...coords.map(i => imageData.data[i]));
}

export default class LinearColorSpaceProjection {
  static name = 'LinearColorSpaceProjection';
  constructor({ inputCanvasName, outputName }) {
    this.inputCanvasName = inputCanvasName;
    this.outputName = outputName;
  }

  async execute(state) {
    const canvas = state[this.inputCanvasName];
    const imageData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);


    const canvasStatistics = new CanvasStatistics(canvas);
    const { average, variance } = canvasStatistics.stats();
    // Calculate normalized, not normalized
    const colorsAlongX = []
    const normalizedColorsAlongX = [];
    const opponencyAlongX = [];
    for (let x = 0; x < imageData.width; x++) {
      const colorsAlongY = []
      const normalizedColorsAlongY = []
      const opponencyAlongY = []
      for (let y = 0; y < imageData.height; y++) {
        const color = getPixelAtCoordinate(x, y, imageData);
        const normalizedColor = new Color(
          color.r - average.r / variance.r,
          color.g - average.g / variance.g,
          color.b - average.b / variance.b,
        )
        colorsAlongY.push(color)
        normalizedColorsAlongY.push(normalizedColor)
        opponencyAlongY.push(normalizedColor.r + normalizedColor.b - 2 * normalizedColor.g);
      }
      colorsAlongX.push(averageColors(colorsAlongY));
      normalizedColorsAlongX.push(averageColors(normalizedColorsAlongY));
      opponencyAlongX.push(calcAverage(opponencyAlongY));
    }
    state[this.outputName] = { colorsAlongX, normalizedColorsAlongX, opponencyAlongX }
    return {
      result: true,
      reason: "",
    }
  }
}