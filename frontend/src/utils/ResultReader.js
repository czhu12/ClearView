
import ColorFilter from "./ColorFilter";
import ImageClustering from "./ImageClustering";

const SHAPES = {
  horizontalLine(w, h) { return w > h },
  verticalLine(w, h) { return w < h }
}

const CONFIGS = {
  standard: {
    results: {2: "positive", 1: "negative"},
    findShapes: SHAPES.horizontalLine,
  },
  visby_indicator: {
    results: {1: "ready"},
    findShapes: SHAPES.verticalLine,
  },
  visby_result: {
    results: {1: "positive", 0: "negative"},
    findShapes: SHAPES.verticalLine,
  }
}

export default class ResultReader {
  static name = 'ResultReader';
  constructor({ threshold, colorTarget, inputCanvasName, outputName, testType}) {
    this.colorTarget = colorTarget;
    this.threshold = threshold;
    this.inputCanvasName = inputCanvasName;
    this.outputName = outputName;
    this.testType = testType;
    this.findShapes = CONFIGS[testType].findShapes
  }

  isCorrectShape(ratio) {
    const splitRatio = ratio.split(":").map(str => Number(str))
    const isCorrectShape = CONFIGS[this.testType].findShapes;
    return isCorrectShape(splitRatio[0], splitRatio[1]);
  }

  getResult(blobs) {
    const shapes = blobs.map(blob => {
      if (this.isCorrectShape(blob.ratio)) return blob
    }).filter(blob => blob);

    const result = CONFIGS[this.testType].results[shapes.length]
    return result
  }

  async execute(state) {
    const { result: coloredNodes } = await new ColorFilter(this).execute(state);

    const canvas = state[this.outputName];
    const context = canvas.getContext("2d");
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const blobs = new ImageClustering(imageData, coloredNodes).execute();

    const result = this.getResult(blobs)
    const reason = result
      ? `Result: ${result}`
      : `Result: inconclusive / Blobs: ${JSON.stringify(blobs)}`

    return {
      result: !!result,
      reason: reason
    };
  }
}
