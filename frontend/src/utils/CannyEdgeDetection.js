import { createCanvas } from "canvas";

export default class CannyEdgeDetection {
  constructor({inputName, outputName}) {
    this.inputName = inputName;
    this.outputName = outputName;
  }

  async execute(state) {
    const canvas = state[this.inputName];
    const context = canvas.getContext("2d");
    const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    const src = cv.matFromImageData(imgData);

    let dst = new cv.Mat();
    cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
    // You can try more different parameters
    cv.Canny(src, dst, 50, 100, 3, false);
    cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA, 0);
    let outputData = new ImageData(new Uint8ClampedArray(dst.data), dst.cols, dst.rows);
    const outputCanvas = createCanvas(canvas.width, canvas.height);
    outputCanvas.getContext("2d").putImageData(outputData, 0, 0);
    state[this.outputName] = outputCanvas;
    return { result: true, reason: null }
  }
}