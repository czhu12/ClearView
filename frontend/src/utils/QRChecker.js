export default class QRChecker {
  constructor({supportedFormats, inputCanvasName, regex, outputName}) {
    this.supportedFormats = supportedFormats;
    this.inputCanvasName = inputCanvasName;
    this.regex = regex;
    this.outputName = outputName;
  }

  async execute(state) {
    let supportedFormats = this.supportedFormats;
    if (!supportedFormats) {
      supportedFormats = await window.BarcodeDetector.getSupportedFormats();
    }

    let barcodeDetector = new window.BarcodeDetector({ formats: supportedFormats });
    const canvas = state[this.inputCanvasName];
    let detector = await barcodeDetector.detect(canvas);
    if (detector.length > 0) {
      state.code = detector[0].rawValue;
      return {
        result: new RegExp(this.regex).test(detector[0].rawValue),
        reason: null,
      }
    } else {
      return {
        result: false,
        reason: "Couldn't find any code present",
      }
    }
  }
}