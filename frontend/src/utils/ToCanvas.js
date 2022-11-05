import { createCanvas, loadImage } from "canvas";
export default class ToCanvas {
  static name = 'ToCanvas';
  constructor({width, height, rotate = null}) {
    this.width = width;
    this.height = height;
    this.rotate = rotate;
  }

  async execute(state) {
    const image = await loadImage(state.base64);
    const canvas = createCanvas(Math.max(image.width, image.height), Math.max(image.width, image.height));
    const ctx = canvas.getContext("2d");
    if (this.rotate) {
      ctx.translate(canvas.width/2,canvas.height/2);
      ctx.rotate(270 * Math.PI / 180)
      ctx.drawImage(image,-this.width/2,-this.height/2);
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
