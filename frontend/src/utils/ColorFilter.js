import { createCanvas } from "canvas";
import Color from "./datautils/Color";


export default class ColorFilter {
  static name = 'ColorFilter';
  constructor({ threshold, colorTarget, inputCanvasName, outputName }) {
    this.colorTarget = colorTarget;
    this.threshold = threshold;
    this.inputCanvasName = inputCanvasName;
    this.outputName = outputName;
  }

  async execute(state) {
    const canvas = state[this.inputCanvasName];
    const context = canvas.getContext("2d");
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let coloredNodes = []

    const outputCanvas = createCanvas(canvas.width, canvas.height);
    const outputContext = outputCanvas.getContext("2d");

    const colorTarget = new Color(
      this.colorTarget[0],
      this.colorTarget[1],
      this.colorTarget[2],
    ).normalize();
    for (let i = 0; i < data.length; i += 4) {
      const color = new Color(data[i], data[i + 1], data[i + 2]);
      const normalized = color.normalize();
      const score = normalized.dot(colorTarget);
      if (score > this.threshold) {
        data[i] = color.r;     // red
        data[i + 1] = color.g; // green
        data[i + 2] = color.b; // blue
        coloredNodes.push(i)
      } else {
        data[i] = 0;     // red
        data[i + 1] = 0; // green
        data[i + 2] = 0; // blue
      }
    }

    outputContext.putImageData(imageData, 0, 0);
    state[this.outputName] = outputCanvas;
    return {
      result: coloredNodes,
      reason: "",
    }
  }

}