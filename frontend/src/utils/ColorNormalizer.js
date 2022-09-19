import { createCanvas } from "canvas";

const colorShift = (canvas, shift) => {
  const context = canvas.getContext("2d");
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] -= shift[0]; // red
    data[i + 1] -= shift[1]; // green
    data[i + 2] -= shift[2]; // blue
  }
  context.putImageData(imageData, 0, 0);
};

export default class ColorNormalizer {
  constructor({samples, inputName, outputName}) {
    this.samples = samples;
    this.inputName = inputName;
    this.outputName = outputName;
  }

  async execute(state) {
    let rDiffs = 0
    let gDiffs = 0;
    let bDiffs = 0;
    for (let i = 0; i < this.samples.length; i++) {
      const { inputName, targetColor } = this.samples[i];
      const sampleCanvas = state[inputName];
      const sampleContext = sampleCanvas.getContext("2d");
      const sampleImageData = sampleContext.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height);
      const data = sampleImageData.data;

      let rDiff = 0;
      let gDiff = 0;
      let bDiff = 0;
      for (let i = 0; i < data.length; i += 4) {
        rDiff += data[i] - targetColor[0]
        gDiff += data[i + 1] - targetColor[1]
        bDiff += data[i + 2] - targetColor[2]
      }
      rDiff = rDiff / data.length;
      gDiff = gDiff / data.length;
      bDiff = bDiff / data.length;
      rDiffs += rDiff;
      gDiffs += gDiff;
      bDiffs += bDiff;
    }

    const inputCanvas = state[this.inputName];
    const canvas = createCanvas(inputCanvas.width, inputCanvas.height);
    const context = canvas.getContext("2d");
    context.drawImage(inputCanvas, 0, 0);
    colorShift(
      canvas,
      [
        rDiffs / this.samples.length,
        gDiffs / this.samples.length,
        bDiffs / this.samples.length
      ],
    );

    state[this.outputName] = canvas;
    return { result: true, reason: null };
  }
}