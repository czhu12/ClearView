import { calcAverage, averageColors } from "./datautils/CanvasStatistics";
import Color from "./datautils/Color";
import { smooth, minimalFindPeaks } from "./datautils/Peaks";


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
  constructor({ inputCanvasName, outputName, peakDetection }) {
    this.inputCanvasName = inputCanvasName;
    this.outputName = outputName;
    this.peakDetection = peakDetection;
  }

  async execute(state) {
    const canvas = state[this.inputCanvasName];
    const imageData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);

    // Calculate normalized, not normalized
    const colorsAlongX = []
    const normalizedColorsAlongX = [];
    const opponencyAlongX = [];
    const bOpponencyAlongX = [];
    for (let x = 0; x < imageData.width; x++) {
      const colorsAlongY = []
      const normalizedColorsAlongY = []
      const opponencyAlongY = []
      const bOpponencyAlongY = []
      for (let y = 0; y < imageData.height; y++) {
        const color = getPixelAtCoordinate(x, y, imageData);
        const normalizedSum = (color.r + color.g + color.b) + 0.00001;
        const normalizedColor = new Color(
          color.r / normalizedSum * 255,
          color.g / normalizedSum * 255,
          color.b / normalizedSum * 255
        )
        colorsAlongY.push(color)
        normalizedColorsAlongY.push(normalizedColor)
        opponencyAlongY.push(normalizedColor.r - normalizedColor.g);
        bOpponencyAlongY.push(normalizedColor.b - (0.60975609756 * normalizedColor.r + 0.39024390243 * normalizedColor.g));
      }
      colorsAlongX.push(averageColors(colorsAlongY));
      normalizedColorsAlongX.push(averageColors(normalizedColorsAlongY));
      opponencyAlongX.push(calcAverage(opponencyAlongY));
      bOpponencyAlongX.push(calcAverage(bOpponencyAlongY));
    }
    const smoothedOpponencyAlongX = smooth(opponencyAlongX, 3);
    const peaks = minimalFindPeaks(smoothedOpponencyAlongX, this.peakDetection.minDistance, this.peakDetection.minHeight);
    state[this.outputName] = { colorsAlongX, normalizedColorsAlongX, opponencyAlongX, bOpponencyAlongX, smoothedOpponencyAlongX, peaks }
    return {
      result: true,
      reason: "",
    }
  }
}