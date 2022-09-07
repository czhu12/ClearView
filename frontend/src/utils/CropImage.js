import { createCanvas } from 'canvas';

export default class CropImage {
  constructor({percentageOfX, percentageOfY, width, height, outputName}) {
    this.percentageOfX = percentageOfX;
    this.percentageOfY = percentageOfY;
    this.width = width;
    this.height = height;
    this.outputName = outputName;
  }

  async execute(state) {
    const canvas = state.canvas;
    const context = canvas.getContext('2d');
    const x1 = canvas.width * this.percentageOfX;
    const y1 = canvas.height * this.percentageOfY;
    const x2 = x1 + this.width;
    const y2 = y1 + this.height;
    let imageData = context.getImageData(x1, y1, x2, y2);
    const newCanvas = createCanvas(this.width, this.height);
    const newContext = newCanvas.getContext('2d');
    newContext.putImageData(imageData, 0, 0);
    state[this.outputName] = newCanvas;
    return { result: true, reason: null }
  }
}

