
import ColorFilter from "./ColorFilter";
import ImageClustering from "./ImageClustering";


export default class ResultReader {
  constructor({ threshold, colorTarget, inputCanvasName, outputName, testType}) {
    this.colorTarget = colorTarget;
    this.threshold = threshold;
    this.inputCanvasName = inputCanvasName;
    this.outputName = outputName;
  }

  async execute(state) {
    const { result: coloredNodes } = await new ColorFilter({ ...this }).execute(state);

    const canvas = state[this.outputName];
    const context = canvas.getContext("2d");
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const blobsById = new ImageClustering(imageData, coloredNodes).execute();
    // TODO - Celina: logic on specific tests based on testType
    return {
      result: blobsById.length,
      reason: `Number of clusters: ${blobsById.length} -------- ${JSON.stringify(blobsById)}`
    };
  }
}
