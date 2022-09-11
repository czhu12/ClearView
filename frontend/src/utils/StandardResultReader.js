export default class StandardResultReader {
  constructor({inputCanvasName}) {
    this.inputCanvasName = inputCanvasName;
  }

  islandSearch() {
  }

  async execute(state) {
    const canvas = state[this.inputCanvasName];
    const context = canvas.getContext("2d");
    context.getImageData(x, y, 1, 1);
  }
}