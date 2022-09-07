import { createCanvas, loadImage } from "canvas";
export default class ToCanvas {
  constructor({width, height}) {
    this.width = width;
    this.height = height;
  }

  async execute(state) {
    const canvas = createCanvas(this.width, this.height);
    const ctx = canvas.getContext("2d");

    const image = await loadImage(state.base64);
    ctx.drawImage(image, 0, 0);
    state.canvas = canvas;
    return {
      result: true,
      reason: "",
    }
  }
}
