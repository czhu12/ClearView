import { createCanvas, loadImage } from "canvas";
export default class ToCanvas {
  constructor({width, height, rotate = null}) {
    this.width = width;
    this.height = height;
    this.rotate = rotate;
  }

  async execute(state) {
    const canvas = createCanvas(this.width, this.height);
    const ctx = canvas.getContext("2d");
    const image = await loadImage(state.base64);
    if (this.rotate) {
      ctx.translate(canvas.width/2,canvas.height/2);
      ctx.rotate(270 * Math.PI / 180)
      ctx.drawImage(image,-this.width/2,-this.width/2);
    } else {
      ctx.drawImage(image, 0, 0)
    }
    state.canvas = canvas;
    return {
      result: true,
      reason: "",
    }
  }
}
